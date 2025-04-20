import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { StyleSheet } from "react-native";
import { Stop } from "@/types";
import React from "react";
import { useTransferStops } from "@/hooks/useTransferStops";
import { useTransportData } from "@/server/queries";
import { useTransferRadius } from "@/store/settingsSliceHooks";
import { useTypedTranslation } from "@/locales/useTypedTranslation";

const TransferStops = (props: Parameters<typeof useTransferStops>[0]) => {
  const { t } = useTypedTranslation();

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
        {t("screens.lineDetails.stopDetails.transferStops", {
          distance: transferRadius,
        })}
      </Text>
      {transfers.length ? (
        transfers.map((transfer) => (
          <Text
            key={`${transfer.line}-${transfer.routeId}-${transfer.stop.id}`}
            style={styles.transferStopsRow}
          >
            {"("}
            {transfer.sameLine
              ? t("screens.lineDetails.stopDetails.sameLine")
              : t("screens.lineDetails.stopDetails.otherLine")}
            {")"} {transfer.line} – {transfer.stop.name}
            {` (${Math.round(transfer.distance)} m)`}
          </Text>
        ))
      ) : (
        <Text style={styles.textCenter}>
          {t("screens.lineDetails.stopDetails.noTransferStops")}
        </Text>
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
  const { t } = useTypedTranslation();

  return (
    <View style={styles.container}>
      <Text type="title">{stop.name}</Text>
      <View style={styles.detailsRow}>
        <Text type="defaultSemiBold">
          {t("screens.lineDetails.stopDetails.averagePeople")}:{" "}
        </Text>
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
