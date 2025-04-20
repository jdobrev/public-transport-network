import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { ICON_SYMBOLS, IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/store/settingsSliceHooks";
import { useTypedTranslation } from "@/locales/useTypedTranslation";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTypedTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.overview"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name={ICON_SYMBOLS.HOME} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: t("tabs.vehicles"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name={ICON_SYMBOLS.TRAIN} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name={ICON_SYMBOLS.SETTINGS} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
