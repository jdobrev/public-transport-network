import { StyleSheet } from "react-native";
import ExpoCheckbox from "expo-checkbox";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Checkbox({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const tint = useThemeColor({}, "primary");
  return (
    <ExpoCheckbox
      value={checked}
      onTouchStart={() => onCheckedChange?.(!checked)}
      color={tint}
      // onValueChange={onCheckedChange}
      style={styles.checkbox}
    />
  );
}
const styles = StyleSheet.create({
  checkbox: {
    height: 32,
    width: 32,
    borderRadius: 8,
  },
});
