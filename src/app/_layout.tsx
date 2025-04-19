import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ComponentProps, useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/store/settingsSliceHooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider as ReduxStoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const ThemeProvider = (
  props: Omit<ComponentProps<typeof RNThemeProvider>, "value">
) => {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <RNThemeProvider
        {...props}
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      />
    </>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ReduxStoreProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <SafeAreaProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </SafeAreaProvider>
            </ThemeProvider>
          </PersistGate>
        </ReduxStoreProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
