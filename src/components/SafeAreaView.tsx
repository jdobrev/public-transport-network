import { useThemeColor } from "@/hooks/useThemeColor";

import {
  SafeAreaView as SafeAreaViewOriginal,
  SafeAreaViewProps as SafeAreaViewOriginalProps,
} from "react-native-safe-area-context";

type SafeAreaViewProps = SafeAreaViewOriginalProps & {
  lightColor?: string;
  darkColor?: string;
};

export function SafeAreaView({
  style,
  lightColor,
  darkColor,
  ...props
}: SafeAreaViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <SafeAreaViewOriginal
      style={[{ backgroundColor, flex: 1 }, style]}
      {...props}
    />
  );
}
