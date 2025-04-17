import {
  StyleSheet,
  RefreshControl,
  ListRenderItem,
  LayoutChangeEvent,
} from "react-native";

import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useVehicles } from "@/server/queries";
import { useCallback, useMemo, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { Vehicle } from "@/types";
import ActivityIndicator from "@/components/ActivityIndicator";
import { SafeAreaView } from "@/components/SafeAreaView";
import Animated from "react-native-reanimated";

const VEHICLE_ITEM_HEIGHT = 100;

import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { GenericListError } from "@/components/Errors";

type RenderItemArgs = Parameters<ListRenderItem<Vehicle>>[0];

const VehicleItem = React.memo(({ item, index }: RenderItemArgs) => {
  return (
    <View style={styles.vehicleContainer}>
      <Text>{index + 1}</Text>
      <View style={styles.vehicle}>
        <Text>{item.vehID}</Text>
      </View>
    </View>
  );
});

export default function VehiclesScreen() {
  const {
    data,
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
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const [listHeight, setListHeight] = useState(0);

  const onListLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setListHeight(height);
  }, []);

  const dynamicThreshold =
    listHeight > 0 ? (5 * VEHICLE_ITEM_HEIGHT) / listHeight : 0.5; // refetch 5 items before the end of the list

  const tabBarHeight = useBottomTabBarHeight();

  const renderVehicle = useCallback((args: RenderItemArgs) => {
    return <VehicleItem {...args} />;
  }, []);

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
