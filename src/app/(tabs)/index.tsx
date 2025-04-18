import React, { useCallback } from "react";

import { Text } from "@/components/Text";
import {
  FILTER_VIEW_TYPE_VALUES,
  FilterViewTypeValue,
} from "@/store/filterSlice";

import { useSetViewType, useViewType } from "@/store/filterSliceHooks";

import { SafeAreaView } from "@/components/SafeAreaView";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";

import useMapPermissions from "@/hooks/useMapPermissions";
import ButtonSwitch from "@/components/Button-switch";

import useNavigateToLineDetails from "@/hooks/useNavigateToLineDetails";
import OverviewMapView from "@/components-screens/index-components/OverviewMapView";
import OverviewSectionList from "@/components-screens/index-components/OverviewSectionList";

export default function OverviewScreen() {
  useMapPermissions();
  const navigateToLineDetails = useNavigateToLineDetails();

  const viewType = useViewType();
  const setViewType = useSetViewType();

  const { Header, scrollHandler, PlaceholderHeader, headerHeight } =
    useCollapsibleHeader(100);

  const onPressLine = useCallback(
    (lineId: string) => {
      navigateToLineDetails(lineId);
    },
    [navigateToLineDetails]
  );

  const onPressFilter = useCallback(() => {
    setViewType(FILTER_VIEW_TYPE_VALUES.LIST);
  }, [setViewType]);

  return (
    <SafeAreaView>
      <Header>
        <Text type="title">Overview</Text>
        <ButtonSwitch<FilterViewTypeValue>
          selectedOptionId={viewType}
          options={[
            { id: FILTER_VIEW_TYPE_VALUES.LIST, label: "List" },
            { id: FILTER_VIEW_TYPE_VALUES.MAP, label: "Map" },
          ]}
          onValueChange={setViewType}
        />
      </Header>
      {viewType === FILTER_VIEW_TYPE_VALUES.LIST ? (
        <OverviewSectionList
          PlaceholderHeader={PlaceholderHeader}
          scrollHandler={scrollHandler}
          headerHeight={headerHeight}
          onPressLine={onPressLine}
        />
      ) : (
        <OverviewMapView
          onPressFilter={onPressFilter}
          onPressLine={onPressLine}
        />
      )}
    </SafeAreaView>
  );
}
