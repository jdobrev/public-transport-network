import React, { ComponentProps, useCallback, useMemo } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { View } from "@/components/View";
import { Text } from "@/components/Text";
import Animated from "react-native-reanimated";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import { SafeAreaView } from "@/components/SafeAreaView";
import { useLineData } from "@/server/queries";
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
import InteractiveMap from "@/components-screens/line-details-components/InteractiveMap";
import { Stop } from "@/types";

const RenderStop = React.memo(
  ({
    stop,
    isActive,
    onPressStop,
  }: {
    stop: Stop;
    isActive: boolean;
    onPressStop: (stop: Stop, isActive: boolean) => void;
  }) => {
    return (
      <Button
        type="ghost"
        hitSlop={10}
        onPress={() => {
          onPressStop(stop, isActive);
        }}
      >
        <Text type="small">{stop.name}</Text>
      </Button>
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
  const isList = viewType === FILTER_VIEW_TYPE_VALUES.LIST;

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

  const onPressStop = useCallback(
    (stop: Stop, isActive: boolean) => {
      if (!activeRoute || !inactiveRoute) return;

      setSelectedStop({
        stop,
        lineId,
        routeId: isActive ? activeRoute.id : inactiveRoute.id,
      });
      if (!isActive) {
        toggleRoute();
      }
      sheetRef.current?.snapToIndex(0);
    },
    [activeRoute, inactiveRoute, lineId]
  );

  const renderMapView = useMemo(() => {
    if (isList || !activeRoute || !inactiveRoute) {
      return null;
    }
    return (
      <InteractiveMap
        activeRoute={activeRoute}
        inactiveRoute={inactiveRoute}
        onPressStop={onPressStop}
        onToggleLine={() => {
          toggleRoute();
          sheetRef.current?.close();
        }}
        selectedStopId={selectedStop?.stop.id}
      />
    );
  }, [isList, activeRoute, inactiveRoute, onPressStop, selectedStop?.stop.id]);

  const scrollEnabled = isError || isFetching || isList; // Disable scroll in map view

  const renderStopItem = useCallback(
    ({ item: stop }: { item: Stop }) => {
      if (!activeRoute) return null;

      return (
        <RenderStop stop={stop} isActive={true} onPressStop={onPressStop} />
      );
    },
    [activeRoute, onPressStop]
  );

  //TODO Fix StopDetails hiding selected stop when selecting a new stop

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

      {/**
       * In List view the FlatList is used to display the list of stops for the selected line.
       * In InteractiveMap view the FlatList is only used for convenient <RefreshControl>.
       */}
      <Animated.FlatList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          scrollEnabled ? (
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              progressViewOffset={headerHeight}
            />
          ) : undefined
        }
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={scrollEnabled}
        data={isList ? activeRoute?.stops : []}
        keyExtractor={(stop) => stop.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={renderStopItem}
        ListHeaderComponent={
          <>
            <PlaceholderHeader />
            {isError && <GenericListError />}
          </>
        }
        ListFooterComponent={renderMapView}
      />

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
  separator: {
    height: 8,
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
