// Garmin Connectの計算式
// throw Errorのときは0を返すように変更
function garmin(lat1, lon1, lat2, lon2) {
  -180 == lon1 && (lon1 = 180);
  var e;
  var o;
  var r;
  var n;
  var a;
  var s;
  var radlat1 = lat1 * Math.PI / 180;
  var radlon1 = lon1 * Math.PI / 180;
  var radlat2 = lat2 * Math.PI / 180;
  var radlon2 = lon2 * Math.PI / 180;
  var l = 6378137.0;
  var f = 1 / 298.257223563;
  var c = (1 - f) * l;
  var y = radlon2 - radlon1;
  var m = (1 - f) * Math.tan(radlat1);
  var M = 1 / Math.sqrt(1 + m * m);
  var b = m * M;
  var N = (1 - f) * Math.tan(radlat2);
  var w = 1 / Math.sqrt(1 + N * N);
  var v = N * w;
  var x = 0;
  var g = 0;
  var S = 0;
  var z = 0;
  var E = 0;
  var W = y;
  var D = 0;
  do {
    e = Math.sin(W);
    o = Math.cos(W);
    r = w * e * (w * e) + (M * v - b * w * o) * (M * v - b * w * o);
    if (0 == r){
      break;
    }
    g = b * v + M * w * o;
    s = W;
    x = Math.sqrt(r);
    n = M * w * e / x;
    z = 1 - n * n;
    a = f / 16 * z * (4 + f * (4 - 3 * z));
    S = Math.atan2(x, g);
    E = 0 != z ? g - 2 * b * v / z : 0;
    W = y + (1 - a) * f * n * (S + a * x * (E + a * g * (2 * E * E - 1)));
    if (Math.abs(W) > Math.PI){
      //console.error({lat1,lon1,lat2,lon2,y});
      return 0;
      //throw new Error("\u03bb > \u03c0");
    }
  } while (Math.abs(W - s) > 1e-12 && ++D < 1e3);
  if (D >= 1e3){
    //throw new Error("Formula failed to converge");
    //console.error({lat1,lon1,lat2,lon2,y});
    return 0;
  }
  var I = z * (l * l - c * c) / (c * c);
  var R = I / 1024 * (256 + I * (I * (74 - 47 * I) - 128));
  var T = c * (1 + I / 16384 * (4096 + I * (I * (320 - 175 * I) - 768))) * (S - R * x * (E + R / 4 * (g * (2 * E * E - 1) - R / 6 * E * (4 * x * x - 3) * (4 * E * E - 3))));
  var P = Math.atan2(w * e, M * v - b * w * o);
  var k = Math.atan2(M * e, -b * w + M * v * o);
  P = (P + 2 * Math.PI) % (2 * Math.PI);
  k = (k + 2 * Math.PI) % (2 * Math.PI);
  /*return {
    distance: T,
    initialBearing: P * 180 / Math.PI,
    finalBearing: k * 180 / Math.PI,
    iterations: D
  }*/
  return T;
}
