import {
  View as ReactNativeView,
  type ViewProps as ReactNativeViewProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ViewProps = ReactNativeViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function View({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <ReactNativeView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
