import { View } from "@/components/View";
import { Text } from "@/components/Text";
import React, { useMemo } from "react";
import Checkbox from "@/components/Checkbox";
import { StyleSheet } from "react-native";
import { useHiddenLineById, useToggleLineById } from "@/store/filterSliceHooks";

export const RenderLine = React.memo(
  ({ id, name }: { id: string; name: string }) => {
    const isHidden = useHiddenLineById(id);
    const toggleLine = useToggleLineById(id);

    return (
      <View style={styles.line}>
        <Text type="small">{name}</Text>
        <Checkbox checked={isHidden} onCheckedChange={toggleLine} />
      </View>
    );
  }
);

export const RenderSectionHeader = React.memo(
  ({
    title,
    filterValue,
    toggle,
  }: {
    title: string;
    filterValue: boolean;
    toggle: () => void;
  }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text type="title">{title}</Text>
        <Checkbox checked={filterValue} onCheckedChange={toggle} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
});
