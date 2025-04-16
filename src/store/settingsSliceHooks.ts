import { useColorScheme as useRNColorScheme } from "react-native";
import { useAppDispatch, useAppSelector } from "./store";
import { settingsSlice } from "./settingsSlice";

export const useColorScheme = () => {
  const colorScheme = useRNColorScheme();
  const colorSchemInStore = useAppSelector(
    (state) => state.settings.colorScheme
  );
  return colorSchemInStore ?? colorScheme ?? "light";
};

export const useSetColorScheme = () => {
  const dispatch = useAppDispatch();
  const setColorScheme = (colorScheme: "light" | "dark") => {
    dispatch(settingsSlice.actions.setColorScheme(colorScheme));
  };
  return setColorScheme;
};
