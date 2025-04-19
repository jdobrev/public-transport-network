import { useMemo } from "react";
import type { Region } from "react-native-maps";

export default function useRoutesRegion(
  routesToRender: {
    coords: { latitude: number; longitude: number }[];
  }[]
): Region | null {
  return useMemo(() => {
    const all: { latitude: number; longitude: number }[] =
      routesToRender.flatMap((r) => r.coords);

    if (all.length === 0) return null;

    let minLat = all[0].latitude,
      maxLat = all[0].latitude,
      minLon = all[0].longitude,
      maxLon = all[0].longitude;

    all.forEach(({ latitude, longitude }) => {
      if (latitude < minLat) minLat = latitude;
      if (latitude > maxLat) maxLat = latitude;
      if (longitude < minLon) minLon = longitude;
      if (longitude > maxLon) maxLon = longitude;
    });

    // centre point
    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLon + maxLon) / 2;

    const latitudeDelta = (maxLat - minLat) * 1.2 || 0.01;
    const longitudeDelta = (maxLon - minLon) * 1.2 || 0.01;

    return { latitude, longitude, latitudeDelta, longitudeDelta };
  }, [routesToRender]);
}
