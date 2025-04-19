import { Text } from "@/components/Text";
import { ICON_SYMBOLS, IconSymbol } from "@/components/ui/IconSymbol";
import { View } from "@/components/View";
import useRoutesRegion from "@/hooks/useRoutesRegion";
import { useShownLines } from "@/hooks/useShownLines";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";

const OverviewMapView = React.memo(
  ({
    onPressFilter,
    onPressLine,
  }: {
    onPressLine: (lineId: string) => void;
    onPressFilter: () => void;
  }) => {
    const linesOnMap = useShownLines();

    const busColor = useThemeColor({}, "busColor");
    const trolleybusColor = useThemeColor({}, "trolleybusColor");
    const tramColor = useThemeColor({}, "tramColor");
    const iconColor = useThemeColor({}, "icon");
    const iconBackgroundColor = useThemeColor({}, "iconBackground");

    const getColor = useCallback(
      (t: string) =>
        t === "A" ? busColor : t === "TB" ? trolleybusColor : tramColor,
      [busColor, tramColor, trolleybusColor]
    );

    const routesToRender = useMemo(() => {
      return linesOnMap.flatMap((line) =>
        line.routes.map((route) => {
          // merge all segments' coordinates into one array so we can draw a single polyline
          const coords = route.segments.flatMap((seg) =>
            seg.coordinates.map((c) => ({
              latitude: c.lat,
              longitude: c.lon,
            }))
          );
          return {
            lineId: line.line,
            routeId: route.id,
            transportType: route.transportType,
            coords,
          };
        })
      );
    }, [linesOnMap]);

    const region = useRoutesRegion(routesToRender);

    const renderLines = useMemo(
      () =>
        routesToRender.map((r) => (
          <Polyline
            key={r.routeId}
            coordinates={r.coords}
            strokeColor={getColor(r.transportType)}
            strokeWidth={10}
            tappable
            onPress={() => onPressLine(r.lineId)}
          />
        )),
      [getColor, onPressLine, routesToRender]
    );

    if (routesToRender.length === 0) {
      return (
        <View style={styles.center}>
          <Text>No lines selected</Text>
        </View>
      );
    }

    return (
      <View style={styles.flex}>
        <MapView
          showsUserLocation
          provider={PROVIDER_GOOGLE}
          style={styles.flex}
          region={
            region ?? {
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }
          }
        >
          {renderLines}
        </MapView>
        <TouchableOpacity
          style={[styles.filterIcon, { backgroundColor: iconBackgroundColor }]}
          onPress={onPressFilter}
        >
          <IconSymbol name={ICON_SYMBOLS.FILTER} size={24} color={iconColor} />
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
    padding: 12,
    borderRadius: 24,
    elevation: 4,
  },
});

export default OverviewMapView;
