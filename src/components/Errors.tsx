import { StyleSheet } from "react-native";

import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { ComponentProps } from "react";
import { useTypedTranslation } from "@/locales/useTypedTranslation";

export function GenericListError({
  style,
  ...props
}: ComponentProps<typeof View>) {
  const { t } = useTypedTranslation();
  return (
    <View {...props} style={[styles.error, style]}>
      <Text>{t("errors.genericListError")}</Text>
      <Text type="faded">{t("errors.genericListErrorDescription")}</Text>
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
