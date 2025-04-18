import { ICON_SYMBOLS, IconSymbol } from "@/components/ui/IconSymbol";
import { View } from "@/components/View";
import { useShownLines } from "@/hooks/useShownLines";
import React, { useMemo } from "react";
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

    const getColor = (t: string) =>
      t === "A" ? "#007AFF" : t === "TB" ? "#32A900" : "#FF375F";

    const initialRegion: Region = useMemo(() => {
      const first = linesOnMap[0]?.routes[0].stops[0].location;
      if (first) {
        return {
          latitude: first.lat,
          longitude: first.lon,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
      }
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 100,
        longitudeDelta: 100,
      };
    }, [linesOnMap]);

    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.flex}
          initialRegion={initialRegion}
          showsUserLocation
        >
          {linesOnMap.map((line) =>
            line.routes.map((route) =>
              route.segments.map((seg) => (
                <Polyline
                  key={seg.id}
                  coordinates={seg.coordinates.map((c) => ({
                    latitude: c.lat,
                    longitude: c.lon,
                  }))}
                  strokeColor={getColor(route.transportType)}
                  strokeWidth={4}
                  tappable
                  onPress={() => onPressLine(line.line)}
                />
              ))
            )
          )}
        </MapView>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "#007AFF",
            padding: 12,
            borderRadius: 24,
            elevation: 4,
          }}
          onPress={onPressFilter}
        >
          <IconSymbol name={ICON_SYMBOLS.FILTER} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default OverviewMapView;
