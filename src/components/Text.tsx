import {
  Text as ReactNativeText,
  type TextProps as ReactNativeTextProps,
  StyleSheet,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type TextProps = ReactNativeTextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "faded"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link";
};

export function Text({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: TextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const colorFaded = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textFaded"
  );

  return (
    <ReactNativeText
      style={[
        { color: type === "faded" ? colorFaded : color },
        type === "default" ? styles.default : undefined,
        type === "faded" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
