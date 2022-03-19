function havesine(lat1, lon1, lat2, lon2){
  const degree = 0.017453292519943295;
  const rlat1 = lat1 * degree;
  const rlon1 = lon1 * degree;
  const rlat2 = lat2 * degree;
  const rlon2 = lon2 * degree;
  return 6.371000790009154e6 * 2 * Math.asin(Math.sqrt(
    (Math.sin((rlat2 - rlat1) * 0.5) ** 2 + Math.cos(rlat1) * Math.cos(rlat2) * (Math.sin((rlon2 - rlon1) * 0.5) ** 2))
  ));
}
