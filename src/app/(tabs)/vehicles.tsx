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
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { Vehicle } from "@/types";
import ActivityIndicator from "@/components/ActivityIndicator";
import { SafeAreaView } from "@/components/SafeAreaView";
import Animated from "react-native-reanimated";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { GenericListError } from "@/components/Errors";
import MapView, { Marker } from "react-native-maps";
import Button from "@/components/Button";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

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
      <Button onPress={() => onPress(item)}>
        <View style={styles.vehicleContainer}>
          <Text>{index + 1}</Text>
          <View style={styles.vehicle}>
            <Text>{item.vehID}</Text>
          </View>
        </View>
      </Button>
    );
  }
);

export default function VehiclesScreen() {
  const [listHeight, setListHeight] = useState(0);
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

  const { Header, scrollHandler, PlaceholderHeader, headerHeight } =
    useCollapsibleHeader();

  const vehicles = useMemo(
    () => vehiclesData?.pages.flatMap((page) => page.data) ?? [],
    [vehiclesData]
  );

  const onListLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setListHeight(height);
  }, []);

  const dynamicThreshold =
    listHeight > 0 ? (5 * VEHICLE_ITEM_HEIGHT) / listHeight : 0.5; // refetch 5 items before the end of the list

  const tabBarHeight = useBottomTabBarHeight();

  const sheetRef = useRef<BottomSheet>(null);
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
            refreshing={isFetching && !isFetchingNextPage}
            onRefresh={refetch}
            progressViewOffset={headerHeight}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={dynamicThreshold}
        ListHeaderComponent={<PlaceholderHeader />}
        ListFooterComponent={
          <View style={{ paddingBottom: tabBarHeight }}>
            {isFetchingNextPage ? <ActivityIndicator /> : null}
          </View>
        }
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
  },
  vehicle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
