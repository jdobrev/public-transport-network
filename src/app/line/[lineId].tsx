import React, { ComponentProps, useCallback, useMemo } from "react";
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
import { Route, Stop } from "@/types";

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
import useRoutesRegion from "@/hooks/useRoutesRegion";

const STROKE_WIDTH = 12;

type ViewRoutesProps = {
  activeRoute: Route;
  inactiveRoute: Route;
  onPressStop: (stop: Stop, isActive: boolean) => void;
  onToggleLine: () => void;
  selectedStopId?: string;
};

const ViewRoutes = React.memo(
  ({
    activeRoute,
    inactiveRoute,
    onPressStop,
    onToggleLine,
    selectedStopId,
  }: ViewRoutesProps) => {
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
          style={styles.map}
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
            strokeColor="#007AFF"
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
              // title={stop.name}
              // titleVisibility="adaptive"
              pinColor={selectedStopId === stop.id ? "red" : "blue"}
            />
          ))}
        </MapView>
      </View>
    );
  }
);

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

  const isList = viewType === FILTER_VIEW_TYPE_VALUES.LIST;

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
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            progressViewOffset={headerHeight}
          />
        }
        scrollEnabled={isError || isList} // Disable scroll in map view
      >
        <PlaceholderHeader />
        {isError && <GenericListError />}

        {isList
          ? !!activeRoute && (
              <View style={{ marginBottom: 16 }}>
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
            )
          : !!activeRoute &&
            !!inactiveRoute && (
              <ViewRoutes
                activeRoute={activeRoute}
                inactiveRoute={inactiveRoute}
                onPressStop={(stop, isActive) => {
                  setSelectedStop({
                    stop,
                    lineId,
                    routeId: isActive ? activeRoute.id : inactiveRoute.id,
                  });
                  if (!isActive) {
                    toggleRoute();
                  }
                  sheetRef.current?.snapToIndex(0);
                }}
                onToggleLine={() => {
                  toggleRoute();
                  sheetRef.current?.close();
                }}
                selectedStopId={selectedStop?.stop.id}
              />
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
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
