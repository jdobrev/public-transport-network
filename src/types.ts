import vehicles from "@/server/mock-api/vehicles.json";
import publicTransportData from "@/server/mock-api/public-transport-data.json";

export type Vehicle = (typeof vehicles)[number];
export type PublicTransportData = (typeof publicTransportData)[number];
export type Route = PublicTransportData["routes"][number];
export type Stop = Route["stops"][number];

export const TRANSPORT_TYPES = {
  A: "A", //"Bus"
  TB: "TB", //"Trolleybus"
  TM: "TM", //"Tram"
} as const;
export type TransportType = keyof typeof TRANSPORT_TYPES;
