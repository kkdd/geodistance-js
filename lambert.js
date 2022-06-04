function lambert(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const degree = Math.PI / 180.0;
  const rlat1 = lat1 * degree;
  const rlon1 = lon1 * degree;
  const rlat2 = lat2 * degree;
  const rlon2 = lon2 * degree;
  
  const beta1 = Math.atan((1 - f) * Math.tan(rlat1));
  const beta2 = Math.atan((1 - f) * Math.tan(rlat2));
  
  const P = (beta1 + beta2) * 0.5;
  const Q = (beta2 - beta1) * 0.5;
  
  const sigma = 2 * Math.asin(Math.sqrt(
    (Math.sin((beta2 - beta1) * 0.5) ** 2 + Math.cos(beta1) * Math.cos(beta2) * (Math.sin((rlon2 - rlon1) * 0.5) ** 2))
  ));
  
  const X = (sigma - Math.sin(sigma)) * (Math.sin(P) * Math.cos(Q) / Math.cos(0.5 * sigma)) * (Math.sin(P) * Math.cos(Q) / Math.cos(0.5 * sigma));
  const Y = (sigma + Math.sin(sigma)) * (Math.cos(P) * Math.sin(Q) / Math.sin(0.5 * sigma)) * (Math.cos(P) * Math.sin(Q) / Math.sin(0.5 * sigma));
  
  return a * (sigma - (0.5 * f) * (X + Y));
}
