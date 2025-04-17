import React, { ComponentProps } from "react";
import { Switch as RNSWitch } from "react-native";

export default function Switch(props: ComponentProps<typeof RNSWitch>) {
  //TODO get colors from theme
  //TODO fix bug where switch transition becomes 'choppy' after some time
  return (
    <RNSWitch
      trackColor={{ false: "#767577", true: "#81b0ff" }}
      thumbColor={props.value ? "#f5dd4b" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      {...props}
    />
  );
}
