import { FlatList, StyleSheet } from "react-native";

import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { FILTER_VIEW_TYPE_VALUES } from "@/store/filterSlice";

import React, { useMemo } from "react";

import {
  useSetViewType,
  useToggleTransportFilter,
  useTransportFilter,
  useViewType,
} from "@/store/filterSliceHooks";

import { SafeAreaView } from "@/components/SafeAreaView";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { TRANSPORT_TYPES } from "@/types";
import Switch from "@/components/Switch";
import Animated from "react-native-reanimated";

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
        <Switch value={value} onValueChange={toggle} />
      </View>
    );
  }
);

export default function OverviewScreen() {
  const viewType = useViewType();
  const setViewType = useSetViewType();

  const transportFilter = useTransportFilter();
  const toggleTransportFilter = useToggleTransportFilter();

  const { Header, scrollHandler, PlaceholderHeader } =
    useCollapsibleHeader(150);

  const filters = useMemo(
    () =>
      [
        {
          id: "viewType",
          value: viewType === FILTER_VIEW_TYPE_VALUES.LIST,
          label: viewTypeLabels[viewType],
          toggle: () =>
            setViewType(
              viewType === FILTER_VIEW_TYPE_VALUES.LIST
                ? FILTER_VIEW_TYPE_VALUES.MAP
                : FILTER_VIEW_TYPE_VALUES.LIST
            ),
        },
        {
          id: "bus",
          value: transportFilter?.[TRANSPORT_TYPES.A] ?? true,
          label: "Bus",
          toggle: () => toggleTransportFilter(TRANSPORT_TYPES.A),
        },
        {
          id: "trolleybus",
          value: transportFilter?.[TRANSPORT_TYPES.TB] ?? true,
          label: "Trolleybus",
          toggle: () => toggleTransportFilter(TRANSPORT_TYPES.TB),
        },
        {
          id: "tram",
          value: transportFilter?.[TRANSPORT_TYPES.TM] ?? true,
          label: "Tram",
          toggle: () => toggleTransportFilter(TRANSPORT_TYPES.TM),
        },
      ] satisfies {
        id: string;
        value: boolean;
        label: string;
        toggle: () => void;
      }[],
    [setViewType, toggleTransportFilter, transportFilter, viewType]
  );

  return (
    <SafeAreaView>
      <Header>
        <Text type="title">Overview</Text>
        <FlatList
          data={filters}
          renderItem={({ item: { label, value, toggle } }) => (
            <RenderFilterToggle label={label} value={value} toggle={toggle} />
          )}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          numColumns={2}
        />
      </Header>
      <Animated.ScrollView onScroll={scrollHandler}>
        <PlaceholderHeader />
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <View key={i}>
              <Text style={{ marginTop: 100, borderBottomWidth: 1 }}>
                Lorem ipsum
              </Text>
            </View>
          ))}
      </Animated.ScrollView>
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
