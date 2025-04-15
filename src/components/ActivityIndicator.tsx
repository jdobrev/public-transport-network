import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ActivityIndicator as ReactNativeActivityIndicator,
  ActivityIndicatorProps as ReactNativeActivityIndicatorProps,
} from "react-native";

type ActivityIndicatorProps = ReactNativeActivityIndicatorProps & {
  lightColor?: string;
  darkColor?: string;
  backgroundLightColor?: string;
  backgroundDarkColor?: string;
};

export default function ActivityIndicator({
  style,
  lightColor,
  darkColor,
  backgroundLightColor,
  backgroundDarkColor,
  ...props
}: ActivityIndicatorProps) {
  const backgroundColor = useThemeColor(
    { light: backgroundLightColor, dark: backgroundDarkColor },
    "background"
  );

  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <ReactNativeActivityIndicator
      size="small"
      color={color}
      style={[
        {
          backgroundColor,
        },
        style,
      ]}
      {...props}
    />
  );
}
