import Button from "@/components/Button";
import { SafeAreaView } from "@/components/SafeAreaView";
import Switch from "@/components/Switch";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { useColorScheme, useSetColorScheme } from "@/store/settingsSliceHooks";
import { StyleSheet } from "react-native";

export default function Settings() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";
  const setColorScheme = useSetColorScheme();

  const { Header, scrollHandler, totalHeaderHeight } = useCollapsibleHeader();

  return (
    <SafeAreaView>
      <Header>
        <Text type="title">Settings</Text>
      </Header>
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
});
