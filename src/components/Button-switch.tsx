import React, { ComponentProps } from "react";
import { View, StyleSheet } from "react-native";
import Button from "./Button";

type ButtonSwitchOption<T extends string> = {
  id: T;
  label: string;
};

type ButtonSwitchProps<T extends string> = {
  selectedOptionId: T;
  options: ButtonSwitchOption<T>[];
  onValueChange: (newValueId: T) => void;
  containerStyle?: ComponentProps<typeof View>["style"];
  buttonStyle?: ComponentProps<typeof Button>["style"];
};

export default function ButtonSwitch<T extends string>({
  selectedOptionId,
  options,
  onValueChange,
  containerStyle,
  buttonStyle,
}: ButtonSwitchProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => (
        <Button
          key={option.id}
          disabled={option.id === selectedOptionId}
          onPressIn={() => onValueChange(option.id)}
          type={option.id === selectedOptionId ? "outline" : "ghost"}
          style={[styles.button, buttonStyle]}
        >
          {option.label}
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
});
