import ButtonSwitch from "@/components/Button-switch";
import { SafeAreaView } from "@/components/SafeAreaView";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { useCollapsibleHeader } from "@/hooks/useCollapsibleHeader";
import { useTypedTranslation } from "@/locales/useTypedTranslation";
import {
  useColorScheme,
  useErrorChance,
  useFetchDelay,
  useLanguage,
  useSetColorScheme,
  useSetErrorChance,
  useSetFetchDelay,
  useSetLanguage,
  useSetTransferRadius,
  useTransferRadius,
} from "@/store/settingsSliceHooks";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

export default function Settings() {
  const { t } = useTypedTranslation();

  const colorScheme = useColorScheme();
  const setColorScheme = useSetColorScheme();

  const language = useLanguage();
  const setLanguage = useSetLanguage();

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
        name: t("screens.settings.theme"),
        options: [
          {
            id: "light",
            label: t("screens.settings.light"),
          },
          {
            id: "dark",
            label: t("screens.settings.dark"),
          },
        ],
        selectedOptionId: colorScheme,
        onValueChange: (newVal: string) => {
          setColorScheme(newVal === "light" ? "light" : "dark");
        },
      },
      {
        name: t("screens.settings.language"),
        options: [
          {
            id: "en",
            label: t("screens.settings.en"),
          },
          {
            id: "bg",
            label: t("screens.settings.bg"),
          },
        ],
        selectedOptionId: language,
        onValueChange: (newVal: string) => {
          setLanguage(newVal === "en" ? "en" : "bg");
        },
      },
      {
        name: t("screens.settings.fetchDelay"),
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
            id: "5000",
            label: "5000",
          },
        ],
        selectedOptionId: fetchDelay,
        onValueChange: (newVal: string) => {
          setFetchDelay(newVal);
        },
      },
      {
        name: t("screens.settings.fetchErrorChance"),
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
        name: t("screens.settings.transferRadius"),
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
      language,
      setColorScheme,
      setErrorChance,
      setFetchDelay,
      setLanguage,
      setTransferRadius,
      t,
      transferRadius,
    ]
  );

  return (
    <SafeAreaView>
      <Header>
        <Text type="title">{t("screens.settings.title")}</Text>
      </Header>
      <Animated.ScrollView onScroll={scrollHandler}>
        <PlaceholderHeader />
        {settings.map((setting) => (
          <View
            key={setting.name}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
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
  settingTitle: {
    marginBottom: 10,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  buttonsContainer: {
    flex: 1,
  },
});
