import { TransportType, TRANSPORT_TYPES } from "@/types";
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
  shownTransports: Record<TransportType, boolean>;
  hiddenLines: Record<string, true | undefined>;
};

const initialState: FilterStore = {
  viewType: "list",
  shownTransports: {
    [TRANSPORT_TYPES.A]: true,
    [TRANSPORT_TYPES.TB]: true,
    [TRANSPORT_TYPES.TM]: true,
  },
  hiddenLines: {},
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setViewType: (state, action: PayloadAction<FilterViewTypeValue>) => {
      state.viewType = action.payload;
    },
    toggleTransportType: (state, action: PayloadAction<TransportType>) => {
      if (!state.shownTransports) {
        state.shownTransports = {
          [TRANSPORT_TYPES.A]: true,
          [TRANSPORT_TYPES.TB]: true,
          [TRANSPORT_TYPES.TM]: true,
        };
      }

      if (!state.shownTransports[action.payload]) {
        state.shownTransports[action.payload] = true;
      } else {
        state.shownTransports[action.payload] = false;
      }
    },
    toggleLine: (state, action: PayloadAction<string>) => {
      const line = action.payload;
      if (!state.hiddenLines) {
        state.hiddenLines = {};
      }

      if (state.hiddenLines[line]) {
        delete state.hiddenLines[line];
      } else {
        state.hiddenLines[line] = true;
      }
    },
  },
});
