import React, { useCallback, useMemo } from "react";
import {
  SectionList,
  StyleSheet,
  SectionListData,
  SectionListRenderItemInfo,
  FlatList,
  RefreshControl,
} from "react-native";

import Animated from "react-native-reanimated";

import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { FILTER_VIEW_TYPE_VALUES } from "@/store/filterSlice";

import {
  useIsBusShown,
  useIsTramShown,
  useIsTrolleybusShown,
  useSetViewType,
  useToggleBusShown,
  useToggleTramShown,
  useToggleTrolleybusShown,
  useViewType,
} from "@/store/filterSliceHooks";

import { SafeAreaView } from "@/components/SafeAreaView";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import Switch from "@/components/Switch";
import { useTransportData } from "@/server/queries";
import { GenericListError } from "@/components/Errors";
import Checkbox from "@/components/Checkbox";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const viewTypeLabels = {
  [FILTER_VIEW_TYPE_VALUES.LIST]: "List",
  [FILTER_VIEW_TYPE_VALUES.MAP]: "Map",
};

const RenderFilterToggle = React.memo(
  ({
    label,
    value,
    toggle,
  }: {
    label: string;
    value: boolean;
    toggle: () => void;
  }) => {
    return (
      <View style={styles.filterRow}>
        <Text>{label}</Text>
        <Checkbox checked={value} onCheckedChange={toggle} />
      </View>
    );
  }
);

export default function OverviewScreen() {
  // TODO decide where to put this
  // const viewType = useViewType();
  // const setViewType = useSetViewType();

  const isBusShown = useIsBusShown();
  const isTrolleybusShown = useIsTrolleybusShown();
  const isTramShown = useIsTramShown();
  const toggleBusShown = useToggleBusShown();
  const toggleTrolleybusShown = useToggleTrolleybusShown();
  const toggleTramShown = useToggleTramShown();

  const { Header, scrollHandler, PlaceholderHeader, headerHeight } =
    useCollapsibleHeader();

  const {
    data: transportData,
    isFetching,
    isError,
    refetch,
  } = useTransportData();

  //TODO decide if we want to use this
  // const filters = useMemo(
  //   () =>
  //     [
  //       {
  //         id: "viewType",
  //         value: viewType === FILTER_VIEW_TYPE_VALUES.LIST,
  //         label: viewTypeLabels[viewType],
  //         toggle: () =>
  //           setViewType(
  //             viewType === FILTER_VIEW_TYPE_VALUES.LIST
  //               ? FILTER_VIEW_TYPE_VALUES.MAP
  //               : FILTER_VIEW_TYPE_VALUES.LIST
  //           ),
  //       },
  //       {
  //         id: "bus",
  //         value: isBusShown,
  //         label: "Bus",
  //         toggle: toggleBusShown,
  //       },
  //       {
  //         id: "trolleybus",
  //         value: isTrolleybusShown,
  //         label: "Trolleybus",
  //         toggle: toggleTrolleybusShown,
  //       },
  //       {
  //         id: "tram",
  //         value: isTramShown,
  //         label: "Tram",
  //         toggle: toggleTramShown,
  //       },
  //     ] satisfies {
  //       id: string;
  //       value: boolean;
  //       label: string;
  //       toggle: () => void;
  //     }[],
  //   [
  //     isBusShown,
  //     isTramShown,
  //     isTrolleybusShown,
  //     setViewType,
  //     toggleBusShown,
  //     toggleTramShown,
  //     toggleTrolleybusShown,
  //     viewType,
  //   ]
  // );

  const sections = useMemo(() => {
    return [
      {
        title: "Bus",
        data: isBusShown
          ? transportData?.A.map((item) => ({
              id: item.line,
              name: item.routes[0].name,
            })) ?? []
          : [],
        filterValue: isBusShown,
        toggle: toggleBusShown,
      },
      {
        title: "Trolleybus",
        data: isTrolleybusShown
          ? transportData?.TB.map((item) => ({
              id: item.line,
              name: item.routes[0].name,
            })) ?? []
          : [],
        filterValue: isTrolleybusShown,
        toggle: toggleTrolleybusShown,
      },
      {
        title: "Tram",
        data: isTramShown
          ? transportData?.TM.map((item) => ({
              id: item.line,
              name: item.routes[0].name,
            })) ?? []
          : [],
        filterValue: isTramShown,
        toggle: toggleTramShown,
      },
    ];
  }, [
    isBusShown,
    isTramShown,
    isTrolleybusShown,
    toggleBusShown,
    toggleTramShown,
    toggleTrolleybusShown,
    transportData?.A,
    transportData?.TB,
    transportData?.TM,
  ]);

  const renderItem = useCallback(
    ({
      item,
    }: SectionListRenderItemInfo<
      (typeof sections)[number]["data"][number]
    >) => {
      if (isError) return null;
      return (
        <View
          style={{
            padding: 15,
            borderBottomWidth: 1,
          }}
        >
          <Text>{item.name}</Text>
        </View>
      );
    },
    [isError]
  );

  const renderSectionHeader = useCallback(
    ({
      section,
    }: SectionListData<(typeof sections)[number]["data"][number]>) => {
      if (isError) return null;
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // backgroundColor: "#eee",
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            // borderColor: "#ccc",
          }}
        >
          <Text type="title">{section.title}</Text>
          <Checkbox
            checked={section.filterValue}
            onCheckedChange={section.toggle}
          />
        </View>
      );
    },
    [isError]
  );

  return (
    <SafeAreaView>
      <Header>
        <Text type="title">Overview</Text>
        {/* <FlatList
          data={filters}
          renderItem={({ item: { label, value, toggle } }) => (
            <RenderFilterToggle label={label} value={value} toggle={toggle} />
          )}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          numColumns={2}
        /> */}
      </Header>
      <AnimatedSectionList
        ListHeaderComponent={
          <>
            <PlaceholderHeader />
            {isError && <GenericListError />}
          </>
        }
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            progressViewOffset={headerHeight}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    width: 150,
  },
});
