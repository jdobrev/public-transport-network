import React, { useCallback, useMemo } from "react";
import {
  SectionList,
  StyleSheet,
  SectionListData,
  SectionListRenderItemInfo,
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
import { useTransportData } from "@/server/queries";
import { GenericListError } from "@/components/Errors";
import Checkbox from "@/components/Checkbox";
import {
  RenderLine,
  RenderSectionHeader,
} from "@/components-screens/index-components";

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
        <Text type="subtitle">{label}</Text>
        <Checkbox checked={value} onCheckedChange={toggle} />
      </View>
    );
  }
);

export default function OverviewScreen() {
  const viewType = useViewType();
  const setViewType = useSetViewType();

  const isBusShown = useIsBusShown();
  const isTrolleybusShown = useIsTrolleybusShown();
  const isTramShown = useIsTramShown();
  const toggleBusShown = useToggleBusShown();
  const toggleTrolleybusShown = useToggleTrolleybusShown();
  const toggleTramShown = useToggleTramShown();

  const { Header, scrollHandler, PlaceholderHeader, headerHeight } =
    useCollapsibleHeader(150);

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

  const busData = useMemo(
    () =>
      transportData?.A.map((item) => ({
        id: item.line,
        name: item.routes[0].name,
      })) ?? [],
    [transportData?.A]
  );

  const trolleybusData = useMemo(
    () =>
      transportData?.TB.map((item) => ({
        id: item.line,
        name: item.routes[0].name,
      })) ?? [],
    [transportData?.TB]
  );
  const tramData = useMemo(
    () =>
      transportData?.TM.map((item) => ({
        id: item.line,
        name: item.routes[0].name,
      })) ?? [],
    [transportData?.TM]
  );

  const sections = useMemo(() => {
    return [
      {
        title: "Bus",
        data: isBusShown ? busData : [],
        filterValue: isBusShown,
        toggle: toggleBusShown,
      },
      {
        title: "Trolleybus",
        data: isTrolleybusShown ? trolleybusData : [],
        filterValue: isTrolleybusShown,
        toggle: toggleTrolleybusShown,
      },
      {
        title: "Tram",
        data: isTramShown ? tramData : [],
        filterValue: isTramShown,
        toggle: toggleTramShown,
      },
    ];
  }, [
    busData,
    tramData,
    trolleybusData,
    isBusShown,
    isTramShown,
    isTrolleybusShown,
    toggleBusShown,
    toggleTramShown,
    toggleTrolleybusShown,
  ]);

  const renderItem = useCallback(
    ({
      item,
    }: SectionListRenderItemInfo<
      (typeof sections)[number]["data"][number]
    >) => {
      if (isError) return null;
      return <RenderLine id={item.id} name={item.name} />;
    },
    [isError]
  );

  const renderSectionHeader = useCallback(
    ({
      section,
    }: SectionListData<(typeof sections)[number]["data"][number]>) => {
      if (isError) return null;
      return (
        <RenderSectionHeader
          filterValue={section.filterValue}
          toggle={section.toggle}
          title={section.title}
        />
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
        <RenderFilterToggle
          label="Interactive map"
          value={viewType === "map"}
          toggle={() => {
            setViewType(
              viewType === FILTER_VIEW_TYPE_VALUES.LIST
                ? FILTER_VIEW_TYPE_VALUES.MAP
                : FILTER_VIEW_TYPE_VALUES.LIST
            );
          }}
        />
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
    // justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 20,
    width: 250,
    gap: 10,
  },
});
