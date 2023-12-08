#!/bin/sh
# using GeodSolve (GeographicLib Utilities)
step=10  # in degree
dist_max=19970000  # in meter

for dist_exponent in $(seq 0 7); do
for dist_significand in 1 3; do
  dist=$((10 ** dist_exponent * dist_significand))
  [ $dist -gt $dist_max ] && dist=$dist_max
  for dir in $(seq 0 $step 90); do
    for lat in $(seq -90 $step 90); do
      echo $lat 0 $dir $dist | sh -c 'w="$(cat)"; /bin/echo -n "$w "; GeodSolve -p 9 --input-string "$w"' | awk '{print $1,$2,$3,$5,$6,$7,$4}'
    done
  done
done
done
