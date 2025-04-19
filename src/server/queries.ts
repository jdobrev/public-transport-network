import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getVehicles,
  getPublicTransportData,
  getLineData,
} from "./mock-api/api";
import { PublicTransportData, TRANSPORT_TYPES, TransportType } from "@/types";

export const useVehicles = () => {
  return useInfiniteQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    retry: false, // This is to enable mock api errors
  });
};

export const useTransportData = () => {
  return useQuery({
    queryKey: ["transportData"],
    queryFn: getPublicTransportData,
    retry: false, // This is to enable mock api errors
  });
};

export const useLineData = (lineId: string) => {
  return useQuery({
    queryKey: ["lineData", lineId],
    queryFn: () => getLineData(lineId),
    retry: false, // This is to enable mock api errors
  });
};

function isTransportType(value: unknown): value is TransportType {
  return Object.values(TRANSPORT_TYPES).some((val) => val === value);
}

const groupByTransportType = (data: PublicTransportData[]) => {
  const groupedData: Record<TransportType, PublicTransportData[]> = {
    A: [],
    TB: [],
    TM: [],
  };

  data.forEach((item) => {
    const transportType = item.routes?.[0]?.transportType;
    if (isTransportType(transportType)) {
      groupedData[transportType].push(item);
    } else {
      console.error(`Invalid transport type: ${transportType}`);
    }
  });

  return groupedData;
};

export const useGroupedTransportData = () => {
  const query = useTransportData();

  const grouped = useMemo(
    () => (query.data ? groupByTransportType(query.data) : undefined),
    [query.data]
  );

  return {
    ...query,
    data: grouped,
  };
};
