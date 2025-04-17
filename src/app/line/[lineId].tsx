import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { View } from "@/components/View";
import { Text } from "@/components/Text";
import Animated from "react-native-reanimated";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import { SafeAreaView } from "@/components/SafeAreaView";
import { useLineData } from "@/server/queries";
import { Route } from "@/types";

import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

function LineMapView({ route }: { route: Route }) {
  const firstStop = route.stops[0].location;
  const initialRegion: Region = {
    latitude: firstStop.lat,
    longitude: firstStop.lon,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {route.stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.location.lat,
              longitude: stop.location.lon,
            }}
            title={stop.name}
          />
        ))}

        {route.segments.map((seg) => (
          <Polyline
            key={seg.id}
            coordinates={seg.coordinates.map((c) => ({
              latitude: c.lat,
              longitude: c.lon,
            }))}
            strokeColor="#007AFF"
            strokeWidth={3}
          />
        ))}
      </MapView>
    </View>
  );
}

export default function LineDetails() {
  const { lineId } = useLocalSearchParams<{ lineId: string }>();
  const { data } = useLineData(lineId);

  const { Header, PlaceholderHeader, scrollHandler, headerHeight } =
    useCollapsibleHeader();

  return (
    <SafeAreaView>
      <Header style={styles.headerInner}>
        <View style={styles.flex}>
          <BackButton />
        </View>
        <View style={styles.title}>
          <Text type="title" style={[{ textAlign: "center" }]}>
            Line {lineId}
          </Text>
        </View>
        <View style={styles.flex} />
      </Header>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <PlaceholderHeader />

        {!!data?.routes?.[0] && <LineMapView route={data.routes[0]} />}

        {data?.routes.map((route) => {
          return (
            <View key={route.id} style={{ marginBottom: 16 }}>
              <Text type="subtitle">{route.name}</Text>
              {route.stops.map((stop) => {
                return (
                  <View key={stop.id} style={{ marginBottom: 8 }}>
                    <Button
                      type="ghost"
                      hitSlop={10}
                      onPress={() => {
                        console.log(stop);
                      }}
                    >
                      <Text type="small">{stop.name}</Text>
                    </Button>
                  </View>
                );
              })}
            </View>
          );
        })}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  title: {
    flex: 3,
  },
  container: { flex: 1 },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
