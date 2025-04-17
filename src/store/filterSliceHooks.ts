import { TRANSPORT_TYPES } from "@/types";
import { FilterViewTypeValue, filterSlice } from "./filterSlice";
import { useAppDispatch, useAppSelector } from "./store";

export const useViewType = () =>
  useAppSelector((state) => state.filter.viewType);

export const useSetViewType = () => {
  const dispatch = useAppDispatch();
  const setViewType = (viewType: FilterViewTypeValue) => {
    dispatch(filterSlice.actions.setViewType(viewType));
  };

  return setViewType;
};

export const useIsBusShown = () => {
  const val = useAppSelector((state) => state.filter.shownTransports.A);
  return val ?? true;
};

export const useIsTrolleybusShown = () => {
  const val = useAppSelector((state) => state.filter.shownTransports.TB);
  return val ?? true;
};

export const useIsTramShown = () => {
  const val = useAppSelector((state) => state.filter.shownTransports.TM);
  return val ?? true;
};

export const useToggleBusShown = () => {
  const dispatch = useAppDispatch();
  const toggleBus = () => {
    dispatch(filterSlice.actions.toggleTransportType(TRANSPORT_TYPES.A));
  };

  return toggleBus;
};

export const useToggleTrolleybusShown = () => {
  const dispatch = useAppDispatch();
  const toggleTrolleybus = () => {
    dispatch(filterSlice.actions.toggleTransportType(TRANSPORT_TYPES.TB));
  };

  return toggleTrolleybus;
};

export const useToggleTramShown = () => {
  const dispatch = useAppDispatch();
  const toggleTram = () => {
    dispatch(filterSlice.actions.toggleTransportType(TRANSPORT_TYPES.TM));
  };

  return toggleTram;
};
