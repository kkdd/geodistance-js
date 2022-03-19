function hubeny(lat1, lon1, lat2, lon2){
  "use strict";
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const e2 = f * (2 - f);
  const degree = Math.PI / 180.0;
  const sin = Math.sin;
  const cos = Math.cos;
  const sqrt = Math.sqrt;
  
  const latdiff = (lat1 - lat2) * degree;
  const londiff = (((lon1 - lon2 + 180) % 360) - 180) * degree;
  const latave = 0.5 * (lat1 + lat2) * degree;
  const sinlatave = sin(latave);
  const coslatave = cos(latave);
  const w2 = 1.0 - sinlatave * sinlatave * e2;
  const w = sqrt(w2);
  const meridian = a * (1 - e2) / (w2 * w);
  const n = a / w;

  return sqrt(
    latdiff * latdiff * meridian * meridian +
    londiff * londiff * n * n * coslatave * coslatave
  );
}
