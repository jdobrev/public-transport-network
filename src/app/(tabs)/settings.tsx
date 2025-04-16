import Button from "@/components/Button";
import { SafeAreaView } from "@/components/SafeAreaView";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useColorScheme, useSetColorScheme } from "@/store/settingsSliceHooks";
import { StyleSheet } from "react-native";

export default function Settings() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";
  const setColorScheme = useSetColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <Text type="title">Settings</Text>
      <View style={styles.settingsRow}>
        <Text>Theme color</Text>
        <View style={styles.settingsButtonsContainer}>
          <Button
            onPress={() => {
              setColorScheme("light");
            }}
            type={isLight ? "outline" : "ghost"}
          >
            <Text>Light</Text>
          </Button>
          <Button
            onPress={() => {
              setColorScheme("dark");
            }}
            type={!isLight ? "outline" : "ghost"}
          >
            Dark
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  settingsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  settingsButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
