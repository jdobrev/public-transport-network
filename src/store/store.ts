import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { filterSlice } from "./filterSlice";
import { settingsSlice } from "./settingsSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  whitelist: [filterSlice.reducerPath, settingsSlice.reducerPath],
};

const rootReducer = combineReducers({
  [filterSlice.reducerPath]: filterSlice.reducer,
  [settingsSlice.reducerPath]: settingsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
