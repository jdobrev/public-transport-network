import { StyleSheet } from "react-native";
import Button from "./Button";
import { View } from "./View";

export default function ButtonSwitch({
  valueLeft,
  textLeft,
  textRight,
  onValueLeftChange,
}: {
  valueLeft: boolean;
  textLeft: string;
  textRight: string;
  onValueLeftChange: (newVal: boolean) => void;
}) {
  return (
    <View style={styles.container}>
      <Button
        disabled={valueLeft}
        onPress={() => {
          onValueLeftChange(true);
        }}
        type={valueLeft ? "outline" : "ghost"}
      >
        {textLeft}
      </Button>
      <Button
        disabled={!valueLeft}
        onPress={() => {
          onValueLeftChange(false);
        }}
        type={!valueLeft ? "outline" : "ghost"}
      >
        {textRight}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});
