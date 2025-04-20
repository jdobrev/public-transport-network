import { Language, LANGUAGES } from "@/locales/translation-config";
import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

type SettingsStore = {
  colorScheme: "light" | "dark" | undefined;
  fetchDelay: string;
  errorChance: string;
  transferRadius: string;
  language: Language;
};

const initialState: SettingsStore = {
  colorScheme: undefined,
  fetchDelay: "250",
  errorChance: "0",
  transferRadius: "20",
  language: LANGUAGES.EN,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setColorScheme: (
      state,
      action: PayloadAction<SettingsStore["colorScheme"]>
    ) => {
      state.colorScheme = action.payload;
    },
    setFetchDelay: (
      state,
      action: PayloadAction<SettingsStore["fetchDelay"]>
    ) => {
      state.fetchDelay = action.payload;
    },
    setErrorChance: (
      state,
      action: PayloadAction<SettingsStore["errorChance"]>
    ) => {
      state.errorChance = action.payload;
    },
    setTransferRadius: (
      state,
      action: PayloadAction<SettingsStore["transferRadius"]>
    ) => {
      state.transferRadius = action.payload;
    },
    setLanguage: (state, action: PayloadAction<SettingsStore["language"]>) => {
      state.language = action.payload;
    },
  },
});
