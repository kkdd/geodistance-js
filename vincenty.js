function vincenty(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const b = (1 - f) * a;
  const e2 = f * (2 - f);
  const MAX_ITERATION = 200;
  const degree = Math.PI / 180.0;

  const L = (lon2 - lon1) * degree;
  const tanT1 = (1 - f) * Math.tan(lat1 * degree);
  const cosT1 = 1 / Math.sqrt(1 + tanT1 * tanT1);
  const sinT1 = tanT1 * cosT1;
  const tanT2 = (1 - f) * Math.tan(lat2 * degree);
  const cosT2 = 1 / Math.sqrt(1 + tanT2 * tanT2);
  const sinT2 = tanT2 * cosT2;

  let l = L, lold, sinl, cosl, sinS, cosS, S, sinA, cos2A, cos2Sm, C;
  for(let i = 0; i < MAX_ITERATION; i++){
    lold = l;
    sinl = Math.sin(l);
    cosl = Math.cos(l);
    sinS = Math.sqrt((cosT2 * sinl) * (cosT2 * sinl) + (cosT1 * sinT2 - sinT1 * cosT2 * cosl) * (cosT1 * sinT2 - sinT1 * cosT2 * cosl));
    cosS = sinT1 * sinT2 + cosT1 * cosT2 * cosl;
    S = Math.atan2(sinS, cosS);
    sinA = cosT1 * cosT2 * sinl / sinS;
    cos2A = 1 - sinA * sinA;
    cos2Sm = cosS - 2 * sinT1 * sinT2 / cos2A;
    C = (f / 16) * cos2A * (4 + f * (4 - 3 * cos2A));
    l = L + (1 - C) * f * sinA * (S + C * sinS * (cos2Sm + C * cosS * (-1 + 2 * cos2Sm * cos2Sm)));
    
    if(Math.abs(l - lold) < 1e-15){
      break;
    }
  }
  
  const u2 = cos2A * e2 / (1 - e2);
  const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const dS = B * sinS * (cos2Sm + (B / 4) * (cosS * (-1 + 2 * cos2Sm * cos2Sm) - (B / 6) * cos2Sm * (-3 + 4 * sinS * sinS) * (-3 + 4 * cos2Sm * cos2Sm)));
  return b * A * (S - dS);
}
