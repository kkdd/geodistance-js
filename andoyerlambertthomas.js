function andoyerlambertthomas(lat1, lon1, lat2, lon2){
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
  const thetadiffhalf = (theta2 - theta1) / 2;
  const londiffhalf = (lon1 - lon2) / 2 * degree;
 
  const cos_theta = cos(theta);
  const sin_theta = sin(theta);
  const cos_thetadiffhalf = cos(thetadiffhalf);
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
  const cos_d = cos_d_half ** 2 - sin_d_half ** 2;

  const u = (sin_theta * cos_thetadiffhalf / cos_d_half) ** 2;
  const v = (cos_theta * sin_thetadiffhalf / sin_d_half) ** 2;
  const x = (u + v) * 2;
  const y = (u - v) * 2;
  const delta_1st = f * (y * sin_d - x * d) / 4;  // 1st order
  if (Math.abs(delta_1st) > 0.01) {return a * d}

  const T = d / sin_d;
  const D = 4 * T * T;
  const E = 2 * cos_d;
  const A = D * E;
  const C = T - (A - E) / 2;
  const n1 = x * (A + C * x);
  const n2 = y * (2 * D + E * y);
  const n3 = D * x * y;
  const delta_2nd = f * f * (n1 - n2 + n3) * sin_d / 64;  // 2nd order
  if (Math.abs(delta_2nd) > 0.003) {return a * (d + delta_1st)}

  return a * (d + delta_1st + delta_2nd);
}

function andoyerlambertthomas_using_cosine_law(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;  // GRS80
  const f = 1 / 298.257223563;  // WGS84
  const degree = Math.PI / 180.0;
  const sin = Math.sin;
  const cos = Math.cos;
  const tan = Math.tan;
  const asin = Math.asin;
  const atan = Math.atan;
  const hypot = Math.hypot;
  const acos = Math.acos;

  const rlat1 = lat1 * degree;
  const rlon1 = lon1 * degree;
  const rlat2 = lat2 * degree;
  const rlon2 = lon2 * degree;
  
  const theta1 = atan((1 - f) * tan(rlat1));  // parametric (reduced) latitude
  const theta2 = atan((1 - f) * tan(rlat2));
  
  const thetadiffhalf = 0.5 * (theta1 - theta2);
  const londiffhalf = 0.5 * (rlon1 - rlon2);
  const theta = 0.5 * (theta1 + theta2); // middle

  const sin_theta = sin(theta);
  const cos_theta = cos(theta);
  const sin_thetadiffhalf = sin(thetadiffhalf);
  const cos_thetadiffhalf = cos(thetadiffhalf);
  const sin2_theta = sin_theta * sin_theta;
  const cos2_theta = cos_theta * cos_theta;
  const sin2_thetadiffhalf = sin_thetadiffhalf * sin_thetadiffhalf;
  const cos2_thetadiffhalf = cos_thetadiffhalf * cos_thetadiffhalf;
  const sin_d_lambda_m = sin(londiffhalf);
  const sin2_d_lambda_m = sin_d_lambda_m * sin_d_lambda_m;

  const H = cos2_theta - sin2_thetadiffhalf;
  const L = sin2_thetadiffhalf + H * sin2_d_lambda_m;
  const cos_d = 1 - 2 * L;

  const d = acos(cos_d);
  const sin_d = sin(d);

  const U = 2 * sin2_theta * cos2_thetadiffhalf / (1 - L);
  const V = 2 * sin2_thetadiffhalf * cos2_theta / L;
  const X = U + V;
  const Y = U - V;
  const T = d / sin_d;
  const D = 4 * T * T;
  const E = 2 * cos_d;
  const A = D * E;
  const B = 2 * D;
  const C = T - (A - E) / 2;

  const n1 = X * (A + C*X);
  const n2 = Y * (B + E*Y);
  const n3 = D * X * Y;

  const delta_1st = f * (T * X - Y) / 4;
  const delta_2nd = f * f * (n1 - n2 + n3) / 64;

  return a * sin_d * (T - delta_1st + delta_2nd);
}
