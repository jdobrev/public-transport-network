import { Image, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { FILTER_VIEW_TYPE_VALUES } from "@/store/filterSlice";

import React from "react";

import { useSetViewType, useViewType } from "@/store/filterSliceHooks";
import Button from "@/components/Button";

export default function OverviewScreen() {
  const viewType = useViewType();
  const setViewType = useSetViewType();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("../../../assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.titleContainer}>
        <Text type="title">Welcome!</Text>
        <HelloWave />
        <Text type="title">{viewType}</Text>
      </View>
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
    </ParallaxScrollView>
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
