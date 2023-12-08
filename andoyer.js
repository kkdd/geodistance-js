function andoyer(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;  // GRS80
  const f = 1 / 298.257223563;  // WGS84
  const d_antipodal = 0.9983242984312529 * Math.PI;  // half meridian arc length
  const degree = Math.PI / 180.0;
  const sin = Math.sin;
  const cos = Math.cos;
  const tan = Math.tan;
  const asin = Math.asin;
  const sqrt = Math.sqrt;
  const hypot = Math.hypot;
  
  const lat = (lat1 + lat2) / 2 * degree; // middle
  const latdiffhalf = (lat1 - lat2) / 2 * degree;
  const londiffhalf = (lon1 - lon2) / 2 * degree;

  const cos_lat = cos(lat);
  const sin_latdiffhalf = sin(latdiffhalf);
  const sin_d_half = hypot(  // sin(d/2) = chord_half
    sin(londiffhalf) * cos_lat,
    cos(londiffhalf) * sin_latdiffhalf
  );
  if (sin_d_half <= 0) {return 0}
  if (sin_d_half >= 1) {return a * d_antipodal}
  
  const d = 2 * asin(sin_d_half);  // 0-th order distance; arc_half = asin(chord_half)

  const cos_d_half = sqrt(1 - sin_d_half ** 2);
  const sin_d = 2 * sin_d_half * cos_d_half;
  const sin_lat = sqrt(1 - cos_lat ** 2);
  const cos_latdiffhalf = sqrt(1 - sin_latdiffhalf ** 2);
  const c = (3 * sin_d - d) * (sin_lat * cos_latdiffhalf / cos_d_half) ** 2;
  const s = (3 * sin_d + d) * (cos_lat * sin_latdiffhalf / sin_d_half) ** 2;
  const delta_1st = f * (c - s) / 2;  // 1st order
  if (Math.abs(delta_1st) > 0.01) {return a * d}

  return a * (d + delta_1st);
} 

function andoyer_using_cosine_law(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;  // GRS80
  const f = 1 / 298.257223563;  // WGS84
  const degree = Math.PI / 180.0;  
  const londiff = (lon1 - lon2) * degree;
  const sin_lat1 = Math.sin(lat1 * degree);
  const sin_lat2 = Math.sin(lat2 * degree);
  const cos_lat1 = Math.cos(lat1 * degree);
  const cos_lat2 = Math.cos(lat2 * degree);
  const d = Math.acos(sin_lat1 * sin_lat2 + cos_lat1 * cos_lat2 * Math.cos(londiff));
  const c = (3 * Math.sin(d) - d) * ((sin_lat1 + sin_lat2) / Math.cos(d / 2)) ** 2;
  const s = (3 * Math.sin(d) + d) * ((sin_lat1 - sin_lat2) / Math.sin(d / 2)) ** 2;
  const delta = f * (c - s) / 8;
  if (Math.abs(delta) > 0.01) {return a * d}
  return a * (d + delta);
}

