"use strict";
let window = self; // for karney
const testdata = [];

addEventListener("message", async function(e){
  postMessage(await (self[e.data.func](...e.data.args)));
});

importScripts(
  "andoyer.js",
  "andoyerlambert.js",
  "andoyerlambertthomas.js",
);
//  "karney.js",

// wrapper for karney
self.karney = (function(){
  const geod = GeographicLib.Geodesic.WGS84;
  
  return function(lat1, lon1, lat2, lon2){
    return geod.Inverse(lat1, lon1, lat2, lon2).s12;
  };
})();

async function loadTestData(){

  const response = await fetch("./GeodTest_for_distance.dat");
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

function benchmark_for_func(funcname){
  const f = window[funcname];
  const dist = [];
  const start = performance.now();
  
  for(const t of testdata){
    dist.push(f(t[0], t[1], t[3], t[4]));
  }
  const time = performance.now() - start;
  
  console.log(`${funcname}: ${time.toFixed(2)}`);
  return {
    dist: dist,
    time: time
  };
}

function startBenchmark(TIME_N, result, ERR_BIN_START, ERR_BIN_END, ERR_BIN_DIV){
  const funcs = [
    "andoyer",
    "andoyer_using_cosine_law",
    "andoyerlambert",
    "andoyerlambert_using_cosine_law",
    "andoyerlambertthomas",
    "andoyerlambertthomas_using_cosine_law",
  ];
//    "karney",

  for(const f of funcs){
    result[f] = result[f] || {
      times: [],
      dist: null,
      errors: {}
    };
  }
  
  for(let i = 0; i < TIME_N; i++){
    for(const f of funcs){
      const r = benchmark_for_func(f);
      result[f].times.push(r.time);
      result[f].dist = r.dist;
    }
  }
  
  for(const f of funcs){
    result[f].errors = analyseError(f, result[f].dist, ERR_BIN_START, ERR_BIN_END, ERR_BIN_DIV);
  }
  
  return result;
}

function analyseError(f, dist, ERR_BIN_START, ERR_BIN_END, ERR_BIN_DIV){
  let error_abs = new Array(ERR_BIN_END - ERR_BIN_START + 1);
  let error_rel = new Array(ERR_BIN_END - ERR_BIN_START + 1);
    
  for(let i = 0; i < testdata.length; i++){
    let err1 = Math.abs(dist[i] - testdata[i][6]);
    let err2 = err1 / testdata[i][6];
    let idx = Math.floor(Math.log10(testdata[i][6])*ERR_BIN_DIV) - ERR_BIN_START;
    
    if (err2 > 0.86 || isNaN(err2)) {console.log(f, testdata[i])}

    if(!error_abs[idx]) error_abs[idx] = -1;
    if(!error_rel[idx]) error_rel[idx] = -1;
    if(err1 > error_abs[idx]) error_abs[idx] = err1;
    if(err2 > error_rel[idx]) error_rel[idx] = err2;
  }
 
  return {
    error_abs,
    error_rel
  }
}
