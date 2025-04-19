import React, { ComponentProps, useCallback } from "react";
import { Dimensions, RefreshControl, StyleSheet } from "react-native";
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
import { GenericListError } from "@/components/Errors";
import ButtonSwitch from "@/components/Button-switch";
import {
  FILTER_VIEW_TYPE_VALUES,
  FilterViewTypeValue,
} from "@/store/filterSlice";
import { useSetViewType, useViewType } from "@/store/filterSliceHooks";
import { Icon } from "@/components/Icon";
import { ICON_SYMBOLS } from "@/components/ui/IconSymbol";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import StopDetails from "@/components-screens/line-details-components/StopDetails";
import { useThemeColor } from "@/hooks/useThemeColor";

function LineMapView({ route }: { route: Route }) {
  const firstStop = route.stops[0].location;
  const initialRegion: Region = {
    latitude: firstStop.lat,
    longitude: firstStop.lon,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.flex}>
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
  const { data, isError, isFetching, refetch } = useLineData(lineId);

  const { Header, PlaceholderHeader, scrollHandler, headerHeight } =
    useCollapsibleHeader(160);

  const viewType = useViewType();
  const setViewType = useSetViewType();

  const [selectedStop, setSelectedStop] = React.useState<ComponentProps<
    typeof StopDetails
  > | null>(null);

  const [selectedRouteIndex, setSelectedRouteIndex] = React.useState<0 | 1>(0);
  const toggleRoute = () => {
    setSelectedRouteIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const activeRoute = data?.routes?.[selectedRouteIndex];
  const inactiveRoute = data?.routes?.[1 - selectedRouteIndex];

  const sheetRef = React.useRef<BottomSheet>(null);
  const handleBackground = useThemeColor({}, "bottomSheetHandleBackground");
  const backgroundColor = useThemeColor({}, "background");

  const onCloseSheet = useCallback(() => {
    sheetRef.current?.close();
    setSelectedStop(null);
  }, []);

  return (
    <SafeAreaView>
      <Header>
        <View style={styles.headerInner}>
          <View style={styles.flex}>
            <BackButton />
          </View>
          <View style={styles.title}>
            <Text type="title" style={[{ textAlign: "center" }]}>
              Line {lineId}
            </Text>
          </View>
          <View style={styles.flex} />
        </View>
        <ButtonSwitch<FilterViewTypeValue>
          selectedOptionId={viewType}
          options={[
            { id: FILTER_VIEW_TYPE_VALUES.LIST, label: "List" },
            { id: FILTER_VIEW_TYPE_VALUES.MAP, label: "Map" },
          ]}
          onValueChange={setViewType}
        />
        {!!activeRoute && (
          <Button
            onPressIn={toggleRoute}
            style={styles.routeNameRow}
            type="ghost"
          >
            <Icon name={ICON_SYMBOLS.DIRECTIONS} />
            <Text type="small">{activeRoute.name}</Text>
            <Icon name={ICON_SYMBOLS.DIRECTIONS} />
          </Button>
        )}
      </Header>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 0 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            progressViewOffset={headerHeight}
          />
        }
      >
        <PlaceholderHeader />
        {isError && <GenericListError />}
        {/* TODO add back 
        {!!data?.routes?.[0] && <LineMapView route={data.routes[0]} />}
        {!!data?.routes?.[1] && <LineMapView route={data.routes[1]} />} */}

        {!!activeRoute && (
          <View key={activeRoute.id} style={{ marginBottom: 16 }}>
            {activeRoute.stops.map((stop) => {
              return (
                <View key={stop.id} style={{ marginBottom: 8 }}>
                  <Button
                    type="ghost"
                    hitSlop={10}
                    onPress={() => {
                      setSelectedStop({
                        stop,
                        lineId,
                        routeId: activeRoute.id,
                      });
                      sheetRef.current?.snapToIndex(0);
                    }}
                  >
                    <Text type="small">{stop.name}</Text>
                  </Button>
                </View>
              );
            })}
          </View>
        )}
      </Animated.ScrollView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={["45%"]}
        enablePanDownToClose
        onClose={onCloseSheet}
        index={-1}
        handleStyle={{ backgroundColor: handleBackground }}
      >
        <BottomSheetScrollView style={[styles.flex, { backgroundColor }]}>
          {!!selectedStop && <StopDetails {...selectedStop} />}
        </BottomSheetScrollView>
      </BottomSheet>
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
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
