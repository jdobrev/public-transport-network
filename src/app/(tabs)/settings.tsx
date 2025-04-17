import Checkbox from "@/components/Checkbox";
import { SafeAreaView } from "@/components/SafeAreaView";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { useColorScheme, useSetColorScheme } from "@/store/settingsSliceHooks";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

export default function Settings() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";
  const setColorScheme = useSetColorScheme();

  const { Header, scrollHandler, PlaceholderHeader } = useCollapsibleHeader();

  return (
    <SafeAreaView>
      <Header>
        <Text type="title">Settings</Text>
      </Header>
      <Animated.ScrollView onScroll={scrollHandler}>
        <PlaceholderHeader />
        <View style={styles.settingsRow}>
          <Text>Dark theme</Text>
          <Checkbox
            checked={!isLight}
            onCheckedChange={() => {
              setColorScheme(isLight ? "dark" : "light");
            }}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 60,
  },
  dummyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
