import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

type SettingsStore = {
  colorScheme: "light" | "dark" | undefined;
};

const initialState: SettingsStore = {
  colorScheme: undefined,
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
  },
});
