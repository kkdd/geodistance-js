function andoyerlambertono(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const degree = Math.PI / 180.0;
  const rlat1 = lat1 * degree;
  const rlon1 = lon1 * degree;
  const rlat2 = lat2 * degree;
  const rlon2 = lon2 * degree;
  
  const p1 = Math.atan((1 - f) * Math.tan(rlat1));
  const p2 = Math.atan((1 - f) * Math.tan(rlat2));
  const cosX = Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(rlon2 - rlon1);
  const X = Math.acos(cosX);
  const c = (Math.sin(p1) + Math.sin(p2)) ** 2;
  const d = (Math.sin(p1) - Math.sin(p2)) ** 2;
  const p = f * a * (X - Math.sin(X)) / (4 * (1 + cosX));
  const q = f * a * (X + Math.sin(X)) / (4 * (1 - cosX));

  return a * X - c * p - d * q;
}
