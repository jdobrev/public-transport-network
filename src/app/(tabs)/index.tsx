import { StyleSheet } from "react-native";

import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { FILTER_VIEW_TYPE_VALUES } from "@/store/filterSlice";

import React from "react";

import { useSetViewType, useViewType } from "@/store/filterSliceHooks";
import Button from "@/components/Button";
import { SafeAreaView } from "@/components/SafeAreaView";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";

export default function OverviewScreen() {
  const viewType = useViewType();
  const setViewType = useSetViewType();
  const { Header, scrollHandler, totalHeaderHeight } = useCollapsibleHeader();
  return (
    <SafeAreaView>
      <Header>
        <Text type="title">Overview</Text>
      </Header>
      <View style={styles.stepContainer}>
        <Button
          onPress={() => {
            setViewType(FILTER_VIEW_TYPE_VALUES.MAP);
          }}
          type={viewType === FILTER_VIEW_TYPE_VALUES.MAP ? "outline" : "ghost"}
        >
          Map
        </Button>
        <Button
          onPress={() => {
            setViewType(FILTER_VIEW_TYPE_VALUES.LIST);
          }}
          type={viewType === FILTER_VIEW_TYPE_VALUES.LIST ? "outline" : "ghost"}
        >
          List
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
