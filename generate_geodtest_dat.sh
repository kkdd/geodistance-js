#!/bin/sh
# constants
step=10  # in degree
dist_max=19970000  # in meter

# using GeodSolve (GeographicLib Utilities)
geodsolve_f () {
  args=$1  # "$lat1 $lon1 $azi1 $s12"
  GeodSolve -p 9 --input-string "$args"  # lat2 lon2 $azi2
}

# main
for dist_exponent in $(seq 0 7); do
for dist_significand in 1 3; do
  dist=$((10 ** dist_exponent * dist_significand))
  [ $dist -gt $dist_max ] && dist=$dist_max

  dist_half=$(awk "BEGIN { print $dist/2 }")
  lat=$(geodsolve_f "90 0 180 $dist_half" | cut -d" " -f1)
  echo $lat 0 0 $lat 180 180 $dist

  for lat in $(seq -90 $step 90); do
    for azi in $(seq 0 $step 90); do
      dest=$(geodsolve_f "$lat 0 $azi $dist")
      echo $lat 0 $azi $dest $dist
    done
  done
done
done
