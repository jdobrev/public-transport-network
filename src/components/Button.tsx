import { ComponentProps } from "react";
import { HapticTab } from "./HapticTab";
import { Text } from "./Text";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type ButtonProps = ComponentProps<typeof HapticTab> & {
  type?: "outline" | "ghost" | "icon";
};

const Button = ({ type = "outline", style, ...props }: ButtonProps) => {
  const children =
    typeof props.children === "string" ? (
      <Text style={styles.text}>{props.children}</Text>
    ) : (
      props.children
    );
  const primaryColor = useThemeColor({}, "primary");

  return (
    //TODO check how it works on iOS
    <HapticTab
      {...props}
      children={children}
      style={[
        styles.base,
        type === "outline"
          ? { borderColor: primaryColor, borderWidth: 1 }
          : undefined,
        type === "icon" ? styles.icon : undefined,
        style,
      ]}
    />
  );
};
export default Button;

const styles = StyleSheet.create({
  base: {
    margin: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  icon: {
    padding: 0,
    margin: 0,
  },
  text: {
    textAlign: "center",
  },
});
