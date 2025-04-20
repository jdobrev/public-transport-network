import { GenericListError } from "@/components/Errors";
import { PressableIcon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { ICON_SYMBOLS } from "@/components/ui/IconSymbol";
import { View } from "@/components/View";
import { HeaderHook } from "@/hooks/useCollapsibleHeader";
import useRoutesRegion from "@/hooks/useRoutesRegion";
import { useShownLines } from "@/hooks/useShownLines";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useCallback, useMemo } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Animated from "react-native-reanimated";

type OverviewMapProps = {
  scrollHandler: HeaderHook["scrollHandler"];
  PlaceholderHeader: HeaderHook["PlaceholderHeader"];
  headerHeight: HeaderHook["headerHeight"];
  onPressLine: (lineId: string) => void;
  onPressFilter: () => void;
};

//TODO add tappable labels to each line for easier selection
//TODO add more colors for each transport type
const OverviewMapView = React.memo(
  ({
    scrollHandler,
    PlaceholderHeader,
    headerHeight,
    onPressFilter,
    onPressLine,
  }: OverviewMapProps) => {
    const { data: linesOnMap, isFetching, refetch, isError } = useShownLines();

    const busColor = useThemeColor({}, "busColor");
    const trolleybusColor = useThemeColor({}, "trolleybusColor");
    const tramColor = useThemeColor({}, "tramColor");

    const getColor = useCallback(
      (t: string) =>
        t === "A" ? busColor : t === "TB" ? trolleybusColor : tramColor,
      [busColor, tramColor, trolleybusColor]
    );

    const routesToRender = useMemo(() => {
      const renderOnlyOneRoute = true; //change this to false to render both routes
      return linesOnMap.flatMap((line) => {
        const routes = renderOnlyOneRoute ? [line.routes[0]] : line.routes;
        return routes.map((route) => {
          // merge all segments' coordinates into one array so we can draw a single polyline
          const coords = route.segments.flatMap((seg) =>
            seg.coordinates.map((c) => ({
              latitude: c.lat,
              longitude: c.lon,
            }))
          );
          return {
            lineId: line.line,
            routeId: route.id,
            transportType: route.transportType,
            coords,
          };
        });
      });
    }, [linesOnMap]);

    const region = useRoutesRegion(routesToRender);

    const renderLines = useMemo(
      () =>
        routesToRender.map((r) => (
          <Polyline
            key={r.routeId}
            coordinates={r.coords}
            strokeColor={getColor(r.transportType)}
            strokeWidth={10}
            tappable
            onPress={() => onPressLine(r.lineId)}
          />
        )),
      [getColor, onPressLine, routesToRender]
    );

    const scrollingEnabled = isFetching || isError;
    const mapViewContent = useMemo(() => {
      if (scrollingEnabled) {
        return null;
      }
      if (routesToRender.length === 0) {
        return (
          <View style={styles.center}>
            <Text>No lines selected</Text>
          </View>
        );
      }

      return (
        <>
          <MapView
            showsUserLocation
            provider={PROVIDER_GOOGLE}
            style={styles.flex}
            region={
              region ?? {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
            }
          >
            {renderLines}
          </MapView>
          <PressableIcon
            name={ICON_SYMBOLS.FILTER}
            onPress={onPressFilter}
            containerStyle={styles.filterIcon}
          />
        </>
      );
    }, [
      onPressFilter,
      region,
      renderLines,
      routesToRender.length,
      scrollingEnabled,
    ]);

    return (
      <Animated.ScrollView
        contentContainerStyle={styles.flex}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          scrollingEnabled ? (
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              progressViewOffset={headerHeight}
              style={{ zIndex: 1000 }}
            />
          ) : undefined
        }
        scrollEnabled={isFetching || isError}
        showsVerticalScrollIndicator={isFetching || isError}
      >
        <PlaceholderHeader />
        {isError && <GenericListError />}
        {mapViewContent}
      </Animated.ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
    padding: 12,
    borderRadius: 24,
    elevation: 4,
  },
});

export default OverviewMapView;
