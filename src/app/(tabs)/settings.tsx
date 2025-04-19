import ButtonSwitch from "@/components/Button-switch";
import { SafeAreaView } from "@/components/SafeAreaView";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import {
  useColorScheme,
  useErrorChance,
  useFetchDelay,
  useSetColorScheme,
  useSetErrorChance,
  useSetFetchDelay,
  useSetTransferRadius,
  useTransferRadius,
} from "@/store/settingsSliceHooks";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

export default function Settings() {
  const colorScheme = useColorScheme();
  const setColorScheme = useSetColorScheme();

  const fetchDelay = useFetchDelay();
  const setFetchDelay = useSetFetchDelay();

  const errorChance = useErrorChance();
  const setErrorChance = useSetErrorChance();

  const transferRadius = useTransferRadius();
  const setTransferRadius = useSetTransferRadius();

  const { Header, scrollHandler, PlaceholderHeader } = useCollapsibleHeader();

  const settings = useMemo(
    () => [
      {
        name: "Theme",
        options: [
          {
            id: "light",
            label: "Light",
          },
          {
            id: "dark",
            label: "Dark",
          },
        ],
        selectedOptionId: colorScheme,
        onValueChange: (newVal: string) => {
          setColorScheme(newVal === "light" ? "light" : "dark");
        },
      },
      {
        name: "Fetch delay (ms)",
        options: [
          {
            id: "250",
            label: "250",
          },
          {
            id: "750",
            label: "750",
          },
          {
            id: "2000",
            label: "2000",
          },
        ],
        selectedOptionId: fetchDelay,
        onValueChange: (newVal: string) => {
          setFetchDelay(newVal);
        },
      },
      {
        name: "Fetch error chance",
        options: [
          {
            id: "0",
            label: "0%",
          },
          {
            id: "0.2",
            label: "20%",
          },
          {
            id: "1",
            label: "100%",
          },
        ],
        selectedOptionId: errorChance,
        onValueChange: (newVal: string) => {
          setErrorChance(newVal);
        },
      },
      {
        name: "Transfer radius (m)",
        options: [
          {
            id: "20",
            label: "20",
          },
          {
            id: "70",
            label: "70",
          },
          {
            id: "200",
            label: "200",
          },
        ],
        selectedOptionId: transferRadius,
        onValueChange: (newVal: string) => {
          setTransferRadius(newVal);
        },
      },
    ],
    [
      colorScheme,
      errorChance,
      fetchDelay,
      setColorScheme,
      setErrorChance,
      setFetchDelay,
      setTransferRadius,
      transferRadius,
    ]
  );

  return (
    <SafeAreaView>
      <Header>
        <Text type="title">Settings</Text>
      </Header>
      <Animated.ScrollView onScroll={scrollHandler}>
        <PlaceholderHeader />
        {settings.map((setting) => (
          <View key={setting.name} style={styles.settingsRow}>
            <Text>{setting.name}</Text>
            <ButtonSwitch
              selectedOptionId={setting.selectedOptionId}
              options={setting.options}
              onValueChange={(newVal: string) => {
                setting.onValueChange(newVal);
              }}
              containerStyle={styles.buttonsContainer}
            />
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
    paddingHorizontal: 15,
  },
  buttonsContainer: {
    maxWidth: 250,
  },
});
