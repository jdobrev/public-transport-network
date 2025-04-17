import { View } from "@/components/View";
import { Text } from "@/components/Text";
import React, { useMemo } from "react";
import Checkbox from "@/components/Checkbox";
import { StyleSheet } from "react-native";
import { useHiddenLineById, useToggleLineById } from "@/store/filterSliceHooks";
import { useRouter } from "expo-router";
import Button from "@/components/Button";

export const RenderLine = React.memo(
  ({ id, name }: { id: string; name: string }) => {
    const router = useRouter();

    const isHidden = useHiddenLineById(id);
    const toggleLine = useToggleLineById(id);

    return (
      <View style={styles.line}>
        <Button
          onPress={() => {
            router.push({
              pathname: "/line/[lineId]",
              params: { lineId: id },
            });
          }}
          type="ghost"
          hitSlop={10}
          style={styles.lineButton}
        >
          <Text type="small" style={styles.lineText}>
            {name}
          </Text>
        </Button>
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
});
