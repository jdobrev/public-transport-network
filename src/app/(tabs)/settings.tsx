import { SafeAreaView } from "@/components/SafeAreaView";
import Switch from "@/components/Switch";
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
          {/**TODO fix bug where switch transition becomes 'choppy' after some time */}
          <Switch
            value={!isLight}
            onValueChange={() => {
              setColorScheme(isLight ? "dark" : "light");
            }}
          />
        </View>
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <View key={i} style={styles.dummyRow}>
              <Text>Setting Option {i + 1}</Text>
              <Switch value={false} onValueChange={() => {}} />
            </View>
          ))}
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
