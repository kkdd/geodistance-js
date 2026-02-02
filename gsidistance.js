/*
Total Inverse Solutions for the Geodesic and Great Elliptic,
B. R. Bowring, Survey Review, 33, 261 (July 1996), 461–476.
*/

function gsidistance(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const MAX_ITERATION = 200;
  
  const abs = Math.abs;
  const sqrt = Math.sqrt;
  const sin = Math.sin;
  const cos = Math.cos;
  const tan = Math.tan;
  const atan = Math.atan;
  const asin = Math.asin;
  const PI = Math.PI;
  const degree = PI / 180;
  
  const l = lon2 - lon1;
  const lp = (((l + 180) % 360) - 180) * degree;
  const L = abs(lp);
  const Lp = PI - L;
  const Delta = ((lp >= 0) ? lat2 - lat1 : lat1 - lat2) * degree;
  const Sigma = (lat1 + lat2) * degree;
  const u1 = (lp >= 0) ? atan((1 - f) * tan(lat1 * degree)) : atan((1 - f) * tan(lat2 * degree));
  const u2 = (lp >= 0) ? atan((1 - f) * tan(lat2 * degree)) : atan((1 - f) * tan(lat1 * degree));
  const Sigmap = u1 + u2;
  const Deltap = u2 - u1;
  const xi = cos(0.5 * Sigmap);
  const xip = sin(0.5 * Sigmap);
  const eta = sin(0.5 * Deltap);
  const etap = cos(0.5 * Deltap);
  
  const x = sin(u1) * sin(u2);
  const y = cos(u1) * cos(u2);
  const c = y * cos(L) + x;
  const epsilon = f * (2 - f) / ((1 - f) * (1 - f));
  
  let ZONE = 1;
  let theta0 = Lp;
  
  if(c >= 0){
    // Zone 1
    theta0 = L * (1 + f * y);
  }else if((0 > c) && (c >= -cos(3 * degree * cos(u1)))){
    // Zone 2
    ZONE = 2;
  }else{
    // Zone 3
    ZONE = 3;
    const R = f * PI * (cos(u1) ** 2) * (1 - 0.25 * f * (1 + f) * (sin(u1) ** 2) + (3 / 16) * f * f * (sin(u1) ** 4));
    const d1 = Lp * cos(u1) - R;
    const d2 = abs(Sigmap) + R;
    const q = Lp / (f * PI);
    const f1 = 0.25 * f * (1 + 0.5 * f);
    const gamma0 = q + f1 * q - f1 * q * q * q;
    
    if(Sigma != 0.0){
      // Zone 3a
      const A0 = atan(d1 / d2);
      const B0 = asin(R / sqrt(d1 * d1 + d2 * d2));
      const psi = A0 + B0;
      const j = gamma0 / cos(u1);
      const k = (1 + f1) * abs(Sigmap) * (1 - f * y) / (f * PI * y);
      const j1 = j / (1 + k / cos(psi));
      if (j1 < 1) {
        const psip = asin(j1);
        const psipp = asin(cos(u1) * j1 / cos(u2));
        theta0 = 2 * atan(tan(0.5 * (psip + psipp)) * sin(0.5 * abs(Sigmap)) / cos(0.5 * Deltap));
      }
    }else{
      if(d1 > 0){
        // Zone 3b1       
      }else if(d1 == 0.0){
        // Zone 3b2
        const Gamma = sin(u2) ** 2;
        const n0 = epsilon * Gamma / ((sqrt(1 + epsilon * Gamma) + 1) ** 2);
        const A = (1 + n0) * (1 + 1.25 * n0 * n0);
        
        return (1 - f) * a * A * PI;
      }else{
        // Zone 3b3
        let gamma = gamma0;
        let gamma1;
        let Gamma;
        let D;
        
        for(let i = 0; i < MAX_ITERATION; i++){
          gamma1 = gamma;
          
          Gamma = 1 - gamma * gamma;
          D = 0.25 * f * (1 + f) - (3 / 16) * f * f * Gamma;
          gamma = q / (1 - D * Gamma);
          
          if(abs(gamma - gamma1) < 1e-15){
            break;
          }
        }
        
        const n0 = epsilon * Gamma / ((sqrt(1 + epsilon * Gamma) + 1) ** 2);
        const A = (1 + n0) * (1 + 1.25 * n0 * n0);
        
        return (1 - f) * a * A * PI;
      }
    }
  }
  
  let g, h, sigma, J, K, gamma, Gamma, zeta, zetap, D, E, F, G;
  let theta = theta0, theta1;
  
  for(let i = 0; i < MAX_ITERATION; i++){
    theta1 = theta;
    
    g = (ZONE == 1) ? sqrt((eta * cos(0.5 * theta)) ** 2 + (xi * sin(0.5 * theta)) ** 2) : sqrt((eta * sin(0.5 * theta)) ** 2 + (xi * cos(0.5 * theta)) ** 2);
    h = (ZONE == 1) ? sqrt((etap * cos(0.5 * theta)) ** 2 + (xip * sin(0.5 * theta)) ** 2) : sqrt((etap * sin(0.5 * theta)) ** 2 + (xip * cos(0.5 * theta)) ** 2);
    sigma = 2 * atan(g / h);
    J = 2 * g * h;
    K = h * h - g * g;
    gamma = y * sin(theta) / J;
    Gamma = 1 - gamma * gamma;
    zeta = Gamma * K - 2 * x;
    zetap = zeta + x;
    D = 0.25 * f * (1 + f) - (3 / 16) * f * f * Gamma;
    E = (1 - D * Gamma) * f * gamma * (sigma + D * J * (zeta + D * K * (2 * zeta * zeta - Gamma * Gamma)));
    F = (ZONE == 1) ? (theta - L - E) : (theta - Lp + E);
    G = f * gamma * gamma * (1 - 2 * D * Gamma) + f * zetap * (sigma / J) * (1 - D * Gamma + 0.5 * f * gamma * gamma) + 0.25 * f * f * zeta * zetap;
    theta = theta - F / (1 - G);
    
    if(abs(F) < 1e-15){
      break;
    }
  }
  
  const n0 = epsilon * Gamma / ((sqrt(1 + epsilon * Gamma) + 1) ** 2);
  const A = (1 + n0) * (1 + 1.25 * n0 * n0);
  const B = epsilon * (1 - 3 * n0 * n0 / 8) / ((sqrt(1 + epsilon * Gamma) + 1) ** 2);
  
  return (1 - f) * a * A * (sigma - B * J * (zeta - 0.25 * B * (K * (Gamma * Gamma - 2 * zeta * zeta) - (1 / 6) * B * zeta * (1 - 4 * K * K) * (3 * Gamma * Gamma - 4 * zeta * zeta))));
}


/* testcode
gsidistance(36.530042355041,0,-48.16427077909776886,5.76234469467651046)  // zone 1
gsidistance(13.320487305712,0,9.18422866656019738,151.30263687191143427)  // zone 2
gsidistance(5.98674750482,0,-3.49379958802986464,179.59957604815423341)   // zone 3a
gsidistance(70.776266785618,0,-70.77626678561799955,179.8008442908662651) // zone 3b1
gsidistance(0.004871023123,0,-0.004871023123,179.39649408251545199)       // zone 3b2
gsidistance(4.199535552987,0,-4.199535552987,179.39810634345499224)       // zone 3b3
*/
