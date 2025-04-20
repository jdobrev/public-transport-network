import { View } from "@/components/View";
import { Text } from "@/components/Text";
import React, { useCallback, useMemo } from "react";
import Checkbox from "@/components/Checkbox";
import { StyleSheet, RefreshControl } from "react-native";
import { useHiddenLineById, useToggleLineById } from "@/store/filterSliceHooks";
import Button from "@/components/Button";
import AnimatedSectionList from "@/components/AnimatedSectionList";
import { useGroupedTransportData } from "@/server/queries";
import { GenericListError } from "@/components/Errors";
import {
  useIsBusShown,
  useIsTramShown,
  useIsTrolleybusShown,
  useToggleBusShown,
  useToggleTramShown,
  useToggleTrolleybusShown,
} from "@/store/filterSliceHooks";
import { HeaderHook } from "@/hooks/useCollapsibleHeader";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTypedTranslation } from "@/locales/useTypedTranslation";

type SectionItem = { id: string; name: string };
type Section = {
  title: string;
  data: SectionItem[];
  filterValue: boolean;
  toggle: () => void;
  color: string;
};

const RenderLine = React.memo(
  ({
    id,
    name,
    onPressLine,
  }: {
    id: string;
    name: string;
    onPressLine: (lineId: string) => void;
  }) => {
    const isHidden = useHiddenLineById(id);
    const toggleLine = useToggleLineById(id);

    return (
      <View style={styles.line}>
        <Button
          onPress={() => onPressLine(id)}
          type="ghost"
          hitSlop={10}
          style={styles.lineButton}
        >
          <Text type="small" style={styles.lineText}>
            {name}
          </Text>
        </Button>
        <Checkbox checked={!isHidden} onCheckedChange={toggleLine} />
      </View>
    );
  }
);

const RenderSectionHeader = React.memo(
  ({
    title,
    filterValue,
    toggle,
    color,
  }: {
    title: string;
    filterValue: boolean;
    color?: string;
    toggle: () => void;
  }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text type="title">{title}</Text>
        <View
          style={{ ...styles.colorHorizontalStripe, backgroundColor: color }}
        />
        <Checkbox checked={filterValue} onCheckedChange={toggle} />
      </View>
    );
  }
);

type OverviewSectionListProps = {
  scrollHandler: HeaderHook["scrollHandler"];
  PlaceholderHeader: HeaderHook["PlaceholderHeader"];
  headerHeight: HeaderHook["headerHeight"];
  onPressLine: (lineId: string) => void;
};

export default React.memo(function OverviewSectionList({
  PlaceholderHeader,
  headerHeight,
  scrollHandler,
  onPressLine,
}: OverviewSectionListProps) {
  const { t } = useTypedTranslation();

  const isBusShown = useIsBusShown();
  const isTrolleybusShown = useIsTrolleybusShown();
  const isTramShown = useIsTramShown();
  const toggleBusShown = useToggleBusShown();
  const toggleTrolleybusShown = useToggleTrolleybusShown();
  const toggleTramShown = useToggleTramShown();

  const busColor = useThemeColor({}, "busColor");
  const trolleybusColor = useThemeColor({}, "trolleybusColor");
  const tramColor = useThemeColor({}, "tramColor");

  const {
    data: transportData,
    isFetching,
    isError,
    refetch,
  } = useGroupedTransportData();

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
        title: t("screens.overview.bus"),
        data: isBusShown ? busData : [],
        filterValue: isBusShown,
        toggle: toggleBusShown,
        color: busColor,
      },
      {
        title: t("screens.overview.trolleybus"),
        data: isTrolleybusShown ? trolleybusData : [],
        filterValue: isTrolleybusShown,
        toggle: toggleTrolleybusShown,
        color: trolleybusColor,
      },
      {
        title: t("screens.overview.tram"),
        data: isTramShown ? tramData : [],
        filterValue: isTramShown,
        toggle: toggleTramShown,
        color: tramColor,
      },
    ];
  }, [
    t,
    isBusShown,
    isTrolleybusShown,
    isTramShown,
    busData,
    trolleybusData,
    tramData,
    busColor,
    trolleybusColor,
    tramColor,
    toggleBusShown,
    toggleTrolleybusShown,
    toggleTramShown,
  ]);

  const renderItem = useCallback(
    (item: SectionItem) => {
      if (isError) return null;
      return (
        <RenderLine id={item.id} name={item.name} onPressLine={onPressLine} />
      );
    },
    [isError, onPressLine]
  );

  const renderSectionHeader = useCallback(
    (section: Section) => {
      if (isError) return null;
      return (
        <RenderSectionHeader
          filterValue={section.filterValue}
          toggle={section.toggle}
          title={section.title}
          color={section.color}
        />
      );
    },
    [isError]
  );

  return (
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
  );
});

const styles = StyleSheet.create({
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  lineButton: {
    padding: 0,
    margin: 0,
    flex: 1,
  },
  lineText: {
    textAlign: "left",
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  colorHorizontalStripe: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    marginHorizontal: 20,
  },
});
