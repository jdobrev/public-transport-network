import React, { useCallback, useMemo } from "react";
import {
  StyleSheet,
  SectionListData,
  SectionListRenderItemInfo,
  RefreshControl,
} from "react-native";

import { Text } from "@/components/Text";
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
import {
  RenderLine,
  RenderSectionHeader,
} from "@/components-screens/index-components";
import useMapPermissions from "@/hooks/useMapPermissions";
import ButtonSwitch from "@/components/Button-switch";

import AnimatedSectionList from "@/components/AnimatedSectionList";

const viewTypeLabels = {
  [FILTER_VIEW_TYPE_VALUES.LIST]: "List",
  [FILTER_VIEW_TYPE_VALUES.MAP]: "Map",
};

type SectionItem = { id: string; name: string };
type Section = {
  title: string;
  data: SectionItem[];
  filterValue: boolean;
  toggle: () => void;
};

export default function OverviewScreen() {
  useMapPermissions();
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

  const sections: Section[] = useMemo(() => {
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
    (item: SectionItem) => {
      if (isError) return null;
      return <RenderLine id={item.id} name={item.name} />;
    },
    [isError]
  );

  const renderSectionHeader = useCallback(
    (section: Section) => {
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
        <ButtonSwitch
          valueLeft={viewType === FILTER_VIEW_TYPE_VALUES.LIST}
          textLeft={viewTypeLabels[FILTER_VIEW_TYPE_VALUES.LIST]}
          textRight={viewTypeLabels[FILTER_VIEW_TYPE_VALUES.MAP]}
          onValueLeftChange={(newVal) => {
            setViewType(
              newVal
                ? FILTER_VIEW_TYPE_VALUES.LIST
                : FILTER_VIEW_TYPE_VALUES.MAP
            );
          }}
        />
      </Header>
      <AnimatedSectionList<SectionItem, Section>
        ListHeaderComponent={
          <>
            <PlaceholderHeader />
            {isError && <GenericListError />}
          </>
        }
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
        renderSectionHeader={({ section }) => renderSectionHeader(section)}
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
