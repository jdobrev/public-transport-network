import { View } from "@/components/View";
import useRoutesRegion from "@/hooks/useRoutesRegion";
import { Route, Stop } from "@/types";
import React, { useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const STROKE_WIDTH = 12;
const STROKE_COLOR = "#007AFF";

type InteractiveMapProps = {
  activeRoute: Route;
  inactiveRoute: Route;
  onPressStop: (stop: Stop, isActive: boolean) => void;
  onToggleLine: () => void;
  selectedStopId?: string;
};

export default React.memo(function InteractiveMap({
  activeRoute,
  inactiveRoute,
  onPressStop,
  onToggleLine,
  selectedStopId,
}: InteractiveMapProps) {
  const { width, height } = useWindowDimensions();

  const activeCoords = useMemo(
    () =>
      activeRoute.segments.flatMap((seg) =>
        seg.coordinates.map((c) => ({
          latitude: c.lat,
          longitude: c.lon,
        }))
      ),
    [activeRoute]
  );

  const inactiveCoords = useMemo(
    () =>
      inactiveRoute.segments.flatMap((seg) =>
        seg.coordinates.map((c) => ({
          latitude: c.lat,
          longitude: c.lon,
        }))
      ),
    [inactiveRoute]
  );

  const region = useRoutesRegion([
    { coords: [...activeCoords] },
    { coords: [...inactiveCoords] },
  ]);

  return (
    <View style={styles.flex}>
      <MapView //TODO add colored arrow icons instead for markers
        provider={PROVIDER_GOOGLE}
        style={{ width, height }}
        region={
          region ?? {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }
        }
        showsUserLocation
      >
        <Polyline
          coordinates={inactiveCoords}
          strokeColor="gray"
          strokeWidth={STROKE_WIDTH}
          tappable
          onPress={onToggleLine}
        />
        {inactiveRoute.stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.location.lat,
              longitude: stop.location.lon,
            }}
            onPress={() => {
              onPressStop(stop, false);
            }}
            titleVisibility="visible"
            pinColor="orange"
          />
        ))}

        <Polyline
          coordinates={activeCoords}
          strokeColor={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
          zIndex={1}
        />
        {activeRoute.stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.location.lat,
              longitude: stop.location.lon,
            }}
            onPress={() => onPressStop(stop, true)}
            pinColor={"blue"}
          />
        ))}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 3,
  },
  routeNameRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});
