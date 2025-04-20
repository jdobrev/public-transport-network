import { useColorScheme as useRNColorScheme } from "react-native";
import { useAppDispatch, useAppSelector } from "./store";
import { settingsSlice } from "./settingsSlice";
import { Language } from "@/locales/translation-config";

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

export const useFetchDelay = () =>
  useAppSelector((state) => state.settings.fetchDelay);
export const useSetFetchDelay = () => {
  const dispatch = useAppDispatch();
  const setFetchDelay = (fetchDelay: string) => {
    dispatch(settingsSlice.actions.setFetchDelay(fetchDelay));
  };
  return setFetchDelay;
};

export const useErrorChance = () =>
  useAppSelector((state) => state.settings.errorChance);
export const useSetErrorChance = () => {
  const dispatch = useAppDispatch();
  const setErrorChance = (errorChance: string) => {
    dispatch(settingsSlice.actions.setErrorChance(errorChance));
  };
  return setErrorChance;
};

export const useTransferRadius = () =>
  useAppSelector((state) => state.settings.transferRadius);

export const useSetTransferRadius = () => {
  const dispatch = useAppDispatch();
  const setTransferRadius = (transferRadius: string) => {
    dispatch(settingsSlice.actions.setTransferRadius(transferRadius));
  };
  return setTransferRadius;
};

export const useLanguage = () =>
  useAppSelector((state) => state.settings.language);
export const useSetLanguage = () => {
  const dispatch = useAppDispatch();
  const setLanguage = (language: Language) => {
    dispatch(settingsSlice.actions.setLanguage(language));
  };
  return setLanguage;
};
