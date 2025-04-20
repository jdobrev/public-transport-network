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
import { useTypedTranslation } from "@/locales/useTypedTranslation";

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

  const { t } = useTypedTranslation();

  return (
    <SafeAreaView>
      <Header>
        <Text type="title">{t("screens.overview.title")}</Text>
        <ButtonSwitch<FilterViewTypeValue>
          selectedOptionId={viewType}
          options={[
            {
              id: FILTER_VIEW_TYPE_VALUES.LIST,
              label: t("screens.overview.list"),
            },
            {
              id: FILTER_VIEW_TYPE_VALUES.MAP,
              label: t("screens.overview.map"),
            },
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
          PlaceholderHeader={PlaceholderHeader}
          scrollHandler={scrollHandler}
          headerHeight={headerHeight}
          onPressFilter={onPressFilter}
          onPressLine={onPressLine}
        />
      )}
    </SafeAreaView>
  );
}
