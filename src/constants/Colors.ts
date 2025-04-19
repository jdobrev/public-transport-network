/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const busColor = "#007AFF";
const trolleybusColor = "#32A900";
const tramColor = "#FF375F";

const primaryLight = tintColorLight;
const primaryDark = "#1D3D47";

export const Colors = {
  light: {
    text: "#11181C",
    textFaded: "#687076",
    background: "#fff",
    tint: tintColorLight,
    icon: "#fff",
    iconBackground: "#007AFF",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: primaryLight,
    busColor,
    trolleybusColor,
    tramColor,
    bottomSheetHandleBackground: "#007AFF",
  },
  dark: {
    text: "#ECEDEE",
    textFaded: "#9BA1A6",
    background: "#151718",
    tint: tintColorDark,
    icon: "#fff",
    iconBackground: "#007AFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    primary: primaryDark,
    busColor,
    trolleybusColor,
    tramColor,
    bottomSheetHandleBackground: "#007AFF",
  },
};
