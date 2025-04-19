import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { StyleSheet } from "react-native";
import { Stop } from "@/types";
import React from "react";
import { useTransferStops } from "@/hooks/useTransferStops";
import { useTransportData } from "@/server/queries";
import { useTransferRadius } from "@/store/settingsSliceHooks";

const TransferStops = (props: Parameters<typeof useTransferStops>[0]) => {
  let transferRadius = 20;
  const transferRadiusFromStore = useTransferRadius();
  if (!!transferRadiusFromStore) {
    let number = parseInt(transferRadiusFromStore);
    if (!isNaN(number) && number >= 0 && number <= 1000000) {
      transferRadius = number;
    }
  }
  const transfers = useTransferStops({
    ...props,
    radiusMeters: transferRadius,
  });

  return (
    <View style={styles.transferStopsContainer}>
      <Text type="subtitle" style={styles.textCenter}>
        Transfer stops (within {transferRadius}m)
      </Text>
      {transfers.length ? (
        transfers.map((t) => (
          <Text
            key={`${t.line}-${t.routeId}-${t.stop.id}`}
            style={styles.transferStopsRow}
          >
            {t.sameLine ? "(same line)" : "(other line)"} {t.line} –{" "}
            {t.stop.name}
            {` (${Math.round(t.distance)} m)`}
          </Text>
        ))
      ) : (
        <Text style={styles.textCenter}>No transfers found</Text>
      )}
    </View>
  );
};

export default React.memo(function StopDetails({
  stop,
  lineId,
  routeId,
}: {
  stop: Stop;
  lineId: string;
  routeId: number;
}) {
  const { data } = useTransportData(); //Thid would maybe be a different call to get more targeted data

  return (
    <View style={styles.container}>
      <Text type="title">{stop.name}</Text>
      <View style={styles.detailsRow}>
        <Text type="defaultSemiBold">Average people: </Text>
        <Text type="defaultSemiBold">{stop.averagePeople}</Text>
      </View>
      {data && (
        <TransferStops
          transportData={data}
          currentStop={stop}
          currentLineId={lineId}
          currentRouteId={routeId}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  transferStopsContainer: {
    gap: 8,
    paddingVertical: 16,
  },
  textCenter: {
    textAlign: "center",
  },
  transferStopsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
