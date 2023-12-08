function andoyerlambert(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;  // GRS80
  const f = 1 / 298.257223563;  // WGS84
  const d_antipodal = 0.9983242984312529 * Math.PI;  // half meridian arc length
  const degree = Math.PI / 180.0;
  const sin = Math.sin;
  const cos = Math.cos;
  const tan = Math.tan;
  const asin = Math.asin;
  const atan = Math.atan;
  const sqrt = Math.sqrt;
  const hypot = Math.hypot;
  
  const theta1 = atan((1 - f) * tan(lat1 * degree));  // parametric (reduced) latitude
  const theta2 = atan((1 - f) * tan(lat2 * degree));
  const theta = (theta1 + theta2) / 2; // middle
  const thetadiffhalf = (theta1 - theta2) / 2;
  const londiffhalf = (lon1 - lon2) / 2 * degree;

  const cos_theta = cos(theta);
  const sin_thetadiffhalf = sin(thetadiffhalf);
  const sin_d_half = hypot(  // sin(d/2) = chord_half
    sin(londiffhalf) * cos_theta,
    cos(londiffhalf) * sin_thetadiffhalf
  );
  if (sin_d_half <= 0) {return 0}
  if (sin_d_half >= 1) {return a * d_antipodal}

  const d = 2 * asin(sin_d_half);  // 0-th order distance; arc_half = asin(chord_half)

  const cos_d_half = sqrt(1 - sin_d_half ** 2);
  const sin_d = 2 * sin_d_half * cos_d_half;
  const sin_theta = sqrt(1 - cos_theta ** 2);
  const cos_thetadiffhalf = sqrt(1 - sin_thetadiffhalf ** 2);
  const c = (sin_d - d) * (sin_theta * cos_thetadiffhalf / cos_d_half) ** 2;
  const s = (sin_d + d) * (cos_theta * sin_thetadiffhalf / sin_d_half) ** 2;
  const delta_1st = f * (c - s) / 2;  // 1st order
  if (Math.abs(delta_1st) > 0.01) {return a * d}

  return a * (d + delta_1st);
}

function andoyerlambert_using_cosine_law(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;  // GRS80
  const f = 1 / 298.257223563;  // WGS84
  const degree = Math.PI / 180.0;  
  const londiff = (lon1 - lon2) * degree;
  const theta1 = Math.atan((1 - f) * Math.tan(lat1 * degree));  // parametric (reduced) latitude
  const theta2 = Math.atan((1 - f) * Math.tan(lat2 * degree));
  const d = Math.acos(Math.sin(theta1) * Math.sin(theta2) + Math.cos(theta1) * Math.cos(theta2) * Math.cos(londiff));
  const c = (Math.sin(d) - d) * ((Math.sin(theta1) + Math.sin(theta2)) / Math.cos(d / 2)) ** 2;
  const s = (Math.sin(d) + d) * ((Math.sin(theta1) - Math.sin(theta2)) / Math.sin(d / 2)) ** 2;
  const delta = f * (c - s) / 8;
  if (Math.abs(delta) > 0.01) {return a * d}
  return a * (d + delta);
}
