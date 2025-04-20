import {
  StyleSheet,
  RefreshControl,
  ListRenderItem,
  LayoutChangeEvent,
} from "react-native";

import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useVehicles } from "@/server/queries";
import { useCallback, useMemo, useRef, useState } from "react";
import React from "react";
import { Vehicle } from "@/types";
import { SafeAreaView } from "@/components/SafeAreaView";
import Animated from "react-native-reanimated";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { GenericListError } from "@/components/Errors";
import MapView, { Marker } from "react-native-maps";
import Button from "@/components/Button";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useThemeColor } from "@/hooks/useThemeColor";

const VEHICLE_ITEM_HEIGHT = 100;
type VehicleListItem = Parameters<ListRenderItem<Vehicle>>[0];

const VehicleItem = React.memo(
  ({
    item,
    index,
    onPress,
  }: VehicleListItem & {
    onPress: (item: Vehicle) => void;
  }) => {
    return (
      <Button
        onPress={() => onPress(item)}
        style={styles.vehicleContainer}
        type="ghost"
      >
        <Text>{index + 1}</Text>
        <View style={styles.vehicle}>
          <Text>{item.vehID}</Text>
        </View>
      </Button>
    );
  }
);

export default function VehiclesScreen() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const {
    data: vehiclesData,
    isError,
    isFetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useVehicles();
  const vehicles = useMemo(
    () => vehiclesData?.pages.flatMap((page) => page.data) ?? [],
    [vehiclesData]
  );

  const [listHeight, setListHeight] = useState(0);
  const { Header, scrollHandler, PlaceholderHeader, headerHeight } =
    useCollapsibleHeader();

  const onListLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setListHeight(height);
  }, []);

  const PREFETCH_ITEMS = 5;
  const rawThreshold =
    listHeight > 0 ? (PREFETCH_ITEMS * VEHICLE_ITEM_HEIGHT) / listHeight : 1;
  // clamp to [0,1]
  const dynamicThreshold = Math.min(1, Math.max(0, rawThreshold));

  const sheetRef = useRef<BottomSheet>(null);
  const handleBackground = useThemeColor({}, "bottomSheetHandleBackground");
  const background = useThemeColor({}, "background");

  // during normal fetching show indicator on top, during pagination show it on bottom
  const bottomLoaderOffset = useMemo(() => listHeight - 100, [listHeight]);
  const progressViewOffset = useMemo(
    () => (isFetchingNextPage ? bottomLoaderOffset : headerHeight),
    [bottomLoaderOffset, headerHeight, isFetchingNextPage]
  );

  const mapRef = useRef<MapView>(null);

  const onCloseSheet = useCallback(() => {
    sheetRef.current?.close();
    setSelectedVehicle(null);
  }, []);

  const onPressVehicle = useCallback((item: Vehicle) => {
    setSelectedVehicle(item);
    sheetRef.current?.snapToIndex(1);
  }, []);

  const renderVehicle = useCallback(
    (args: VehicleListItem) => {
      return <VehicleItem {...args} onPress={onPressVehicle} />;
    },
    [onPressVehicle]
  );

  return (
    <SafeAreaView>
      <Header>
        <View>
          <Text type="title">Vehicles</Text>
        </View>
      </Header>
      <Animated.FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.vehID}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            progressViewOffset={progressViewOffset}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={dynamicThreshold}
        ListHeaderComponent={<PlaceholderHeader />}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: VEHICLE_ITEM_HEIGHT,
          offset: VEHICLE_ITEM_HEIGHT * index,
          index,
        })}
        refreshing={isFetching}
        ListEmptyComponent={isError ? <GenericListError /> : null}
        onLayout={onListLayout}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />

      <BottomSheet
        ref={sheetRef}
        snapPoints={["65%"]}
        enablePanDownToClose
        onClose={onCloseSheet}
        index={-1}
        handleStyle={{ backgroundColor: handleBackground }}
        backgroundStyle={{ backgroundColor: background }}
      >
        <BottomSheetView style={styles.flex}>
          {!!selectedVehicle && (
            <MapView
              ref={mapRef}
              style={styles.flex}
              region={{
                latitude: selectedVehicle.lat,
                longitude: selectedVehicle.lon,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: selectedVehicle.lat,
                  longitude: selectedVehicle.lon,
                }}
              />
            </MapView>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  vehicleContainer: {
    height: VEHICLE_ITEM_HEIGHT,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    margin: 0,
  },
  vehicle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
