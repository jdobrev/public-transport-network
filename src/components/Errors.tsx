import { StyleSheet } from "react-native";

import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { ComponentProps } from "react";

export function GenericListError({
  style,
  ...props
}: ComponentProps<typeof View>) {
  return (
    <View {...props} style={[styles.error, style]}>
      <Text>Something went wrong</Text>
      <Text type="faded">Refresh to try again</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    gap: 8,
  },
});
