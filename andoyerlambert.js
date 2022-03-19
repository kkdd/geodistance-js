function andoyerlambert(lat1, lon1, lat2, lon2){
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const degree = Math.PI / 180.0;
  const rlat1 = lat1 * degree;
  const rlon1 = lon1 * degree;
  const rlat2 = lat2 * degree;
  const rlon2 = lon2 * degree;
  
  const p1 = Math.atan((1 - f) * Math.tan(rlat1));
  const p2 = Math.atan((1 - f) * Math.tan(rlat2));
  const sd = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(rlon2 - rlon1));
  const c = (Math.sin(sd) - sd) * ((Math.sin(p1) + Math.sin(p2)) / Math.cos(0.5 * sd)) ** 2;
  const s = (Math.sin(sd) + sd) * ((Math.sin(p1) - Math.sin(p2)) / Math.sin(0.5 * sd)) ** 2;
  const delta = 0.125 * f * (c - s);
  
  return a * (sd + delta);
}
