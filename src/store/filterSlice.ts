import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

export const FILTER_VIEW_TYPE_VALUES = {
  LIST: "list",
  MAP: "map",
} as const;

export type FilterViewTypeValue =
  (typeof FILTER_VIEW_TYPE_VALUES)[keyof typeof FILTER_VIEW_TYPE_VALUES];

type FilterStore = {
  viewType: FilterViewTypeValue;
};

const initialState: FilterStore = {
  viewType: "list",
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setViewType: (state, action: PayloadAction<FilterViewTypeValue>) => {
      state.viewType = action.payload;
    },
  },
});
