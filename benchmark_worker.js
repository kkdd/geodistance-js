let window = self; // geographiclib用
const testdata = [];

addEventListener("message", async function(e){
  //console.log(e.data);
  postMessage(await (self[e.data.func](...e.data.args)));
});

importScripts(
  "haversine.js",
  "hubeny_simple.js",
  "hubeny_series.js",
  "gsidistance.js",
  "vincenty.js",
  "lambert.js",
  "andoyerlambert.js",
  "andoyerlambertthomas.js",
  "geographiclib.js"
);

// wrapper for geographiclib.js
self.geographiclib = (function(){
  const geod = GeographicLib.Geodesic.WGS84;
  
  return function(lat1, lon1, lat2, lon2){
    return geod.Inverse(lat1, lon1, lat2, lon2).s12;
  };
})();

/**
 * テストデータ読み込み
 */
async function loadTestData(){
//  const response = await fetch("./GeodTest.dat"); // GitHub limit over
  const response = await fetch("./GeodTest-short.dat");
  const text = await response.text();
  
  const lines = text.split(/\n/);
  for(let i = 0; i < lines.length; i++){
    let cols = lines[i].split(/\s+/);
    if(cols.length >= 6){
      let buf = [];
      for(let j = 0; j < cols.length; j++){
        buf.push(cols[j] - 0);
      }
      testdata.push(buf);
    }
  }
  
  let distance_min = Number.MAX_VALUE;
  let distance_max = -Number.MAX_VALUE;
  for(let i = 0; i < testdata.length; i++){
    if(testdata[i][6] < distance_min) distance_min = testdata[i][6];
    if(distance_max < testdata[i][6]) distance_max = testdata[i][6];
  }
  
  return {testdata, distance_min, distance_max};
}

/**
 * 関数のベンチマークを行う
 */
function benchmarkFunction(funcname){
  const f = window[funcname];
  const dist = [];
  const start = performance.now();
  
  for(const t of testdata){
    dist.push(f(t[0], t[1], t[3], t[4]));
  }
  const time = performance.now() - start;
  
  console.log(`${funcname}: ${time}`);
  return {
    dist: dist,
    time: time
  };
}
