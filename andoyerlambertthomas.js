function andoyerlambertthomas(lat1, lon1, lat2, lon2){
  const a = 6378137.0;
  const F = 1 / 298.257223563;
  const degree = Math.PI / 180.0;
  const rlat1 = lat1 * degree;
  const rlon1 = lon1 * degree;
  const rlat2 = lat2 * degree;
  const rlon2 = lon2 * degree;
  
  const b = (1 - F);
  const f = 0.5 * (rlat2 + rlat1);
  const g = 0.5 * (rlat2 - rlat1);
  const l = 0.5 * (rlon2 - rlon1);
  
  const sf = Math.sin(f), sg = Math.sin(g), sl = Math.sin(l);
  const s2f = sf * sf, s2g = sg * sg, s2l = sl * sl;
  const c2f = 1 - s2f, c2g = 1 - s2g, c2l = 1 - s2l;
  
  const s2 = s2g * c2l + c2f * s2l;
  const c2 = c2g * c2l + s2f * s2l;
  
  const s = Math.sqrt(s2), c = Math.sqrt(c2);
  const omega = Math.atan2(s, c);
  const rr = s * c;
  const aa = s2g * c2f / s2 + s2f * c2g / c2;
  const bb = s2g * c2f / s2 - s2f * c2g / c2;
  const pp = rr / omega;
  const qq = omega / rr;
  const d2 = s2 - c2;
  const qp = qq + 6*pp;
  const eps1 = 0.5 * F * (-aa - 3 * bb * pp);
  const eps2 = 0.25 * F * F * ((-qp * bb + (-3.75 + d2 * (qq + 3.75 * pp)) * aa + 4 - d2 * qq) * aa - (7.5 * d2 * bb * pp - qp) * bb);

  return 2*omega*a*(1 + eps1 + eps2);
}
