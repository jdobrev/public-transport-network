import { useRouter } from "expo-router";
import { ComponentProps } from "react";
import Button from "@/components/Button";
import { ICON_SYMBOLS, IconSymbol } from "@/components//ui/IconSymbol";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function BackButton({
  style,
}: {
  style?: ComponentProps<typeof Button>["style"];
}) {
  const router = useRouter();
  const color = useThemeColor({}, "text");

  return (
    <Button
      onPress={() => router.back()}
      style={[style]}
      hitSlop={10}
      type="icon"
    >
      <IconSymbol name={ICON_SYMBOLS.CHEVRON_LEFT} size={32} color={color} />
    </Button>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: 16,
  },
});
