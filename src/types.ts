import vehicles from "@/server/mock-api/vehicles.json";
import publicTransportData from "@/server/mock-api/public-transport-data.json";

export type Vehicle = (typeof vehicles)[number];
export type PublicTransportData = (typeof publicTransportData)[number];

export const TRANSPORT_TYPES = {
  A: {
    value: "A",
    label: "Bus",
  },
  TB: {
    value: "TB",
    label: "Trolleybus",
  },
  TM: {
    value: "TM",
    label: "Tram",
  },
} as const;
export type TransportType = keyof typeof TRANSPORT_TYPES;
