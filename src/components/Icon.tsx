import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "./ui/IconSymbol";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ComponentProps } from "react";
import { View } from "@/components/View";

type IconBaseProps = Omit<ComponentProps<typeof IconSymbol>, "color"> & {
  color?: string;
};

function IconBase({ name, size = 24, color, ...iconProps }: IconBaseProps) {
  const iconColor = useThemeColor({}, "icon");
  return <IconSymbol name={name} size={24} color={iconColor} {...iconProps} />;
}

export function Icon({ ...iconProps }: IconBaseProps) {
  const iconBackgroundColor = useThemeColor({}, "iconBackground");
  return (
    <View
      style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}
    >
      <IconBase {...iconProps} />
    </View>
  );
}

type PressableIconProps = {
  name: IconBaseProps["name"];
  onPress: ComponentProps<typeof TouchableOpacity>["onPress"];
  containerStyle?: ComponentProps<typeof TouchableOpacity>["style"];
  pressableProps?: ComponentProps<typeof TouchableOpacity>;
  iconProps?: IconBaseProps;
};
export function PressableIcon({
  name,
  onPress,
  containerStyle,
  iconProps,
  pressableProps,
}: PressableIconProps) {
  const iconBackgroundColor = useThemeColor({}, "iconBackground");
  return (
    <TouchableOpacity
      style={[
        styles.pressableIconContainer,
        { backgroundColor: iconBackgroundColor },
        containerStyle,
      ]}
      onPress={onPress}
      {...pressableProps}
    >
      <IconBase name={name} {...iconProps} />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  iconContainer: {
    padding: 4,
    borderRadius: 4,
    elevation: 4,
  },
  pressableIconContainer: {
    padding: 12,
    borderRadius: 24,
    elevation: 4,
  },
});
