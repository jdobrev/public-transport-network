import { useGroupedTransportData } from "@/server/queries";
import { useAppSelector } from "@/store/store";
import { PublicTransportData } from "@/types";
import { useMemo } from "react";

export const useShownLines = () => {
  const query = useGroupedTransportData();
  const transportData = query.data;

  const hiddenLines = useAppSelector((state) => state.filter.hiddenLines);
  const shownTransports = useAppSelector(
    (state) => state.filter.shownTransports
  );

  return useMemo(() => {
    const shownLines: PublicTransportData[] = [];
    if (!transportData) {
      return { ...query, data: [] };
    }
    if (shownTransports.A) {
      const busLines = transportData.A.filter(
        (item) => hiddenLines[item.line] !== true
      );
      shownLines.push(...busLines);
    }
    if (shownTransports.TB) {
      const trolleybusLines = transportData.TB.filter(
        (item) => hiddenLines[item.line] !== true
      );
      shownLines.push(...trolleybusLines);
    }
    if (shownTransports.TM) {
      const tramLines = transportData.TM.filter(
        (item) => hiddenLines[item.line] !== true
      );
      shownLines.push(...tramLines);
    }

    return { ...query, data: shownLines };
  }, [
    hiddenLines,
    query,
    shownTransports.A,
    shownTransports.TB,
    shownTransports.TM,
    transportData,
  ]);
};
