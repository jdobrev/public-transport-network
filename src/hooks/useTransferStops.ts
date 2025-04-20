import { PublicTransportData, Stop, TransportType } from "@/types";
import { useMemo } from "react";

/** A found transfer opportunity */
export interface TransferStop {
  line: string;
  routeId: number;
  transportType: string;
  stop: Stop;
  distance: number; // meters from current
  sameLine: boolean;
}

// Thanks ChatGPT :)
// Read more about the formula: https://medium.com/@gega.abzianidze.1/haversine-formula-in-react-native-abda04843888
function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000; // earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find all stops within `radiusMeters` of the given stop.
 * Excludes the stop itself and stops on the same route.
 */
export function useTransferStops({
  transportData,
  currentLineId,
  currentRouteId,
  currentStop,
  radiusMeters = 20,
}: {
  transportData: PublicTransportData[];
  currentLineId: string;
  currentRouteId: number;
  currentStop: Stop;
  radiusMeters?: number;
}): TransferStop[] {
  return useMemo(() => {
    const results: TransferStop[] = [];
    const { lat: curLat, lon: curLon } = currentStop.location;

    for (const line of transportData) {
      for (const route of line.routes) {
        for (const stop of route.stops) {
          // skip all stops on the same route
          if (
            line.line === currentLineId &&
            currentRouteId === route.id
            // && stop.id === currentStop.id //include this to only skip the current stop but show other stops on the same route
          ) {
            continue;
          }

          const d = getDistanceMeters(
            curLat,
            curLon,
            stop.location.lat,
            stop.location.lon
          );

          if (d <= radiusMeters) {
            results.push({
              line: line.line,
              routeId: route.id,
              transportType: route.transportType,
              stop,
              distance: d,
              sameLine: line.line === currentLineId,
            });
          }
        }
      }
    }

    // sort nearest first
    return results.sort((a, b) => a.distance - b.distance);
  }, [
    currentStop.location,
    transportData,
    currentLineId,
    currentRouteId,
    radiusMeters,
  ]);
}
