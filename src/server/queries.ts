import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getVehicles, getPublicTransportData } from "./mock-api/api";
import { TransportType } from "@/types";

export const useVehicles = () => {
  return useInfiniteQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    retry: false, // This is to enable mock api errors
  });
};

export const useTransportData = (filter?: TransportType) => {
  return useQuery({
    queryKey: ["transportData"],
    queryFn: getPublicTransportData,
    retry: false, // This is to enable mock api errors
    select: (data) => {
      if (!filter) return data;
      return data.filter((item) => item.routes?.[0]?.transportType === filter); //This relies on the assumption that all routes for a given line have the same transport type
    },
  });
};
