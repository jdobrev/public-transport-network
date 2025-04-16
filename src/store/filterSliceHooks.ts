import { TransportType } from "@/types";
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

export const useTransportFilter = () =>
  useAppSelector((state) => state.filter.shownTransports);

export const useToggleTransportFilter = () => {
  const dispatch = useAppDispatch();
  const toggleTransport = (transportType: TransportType) => {
    dispatch(filterSlice.actions.toggleTransportType(transportType));
  };

  return toggleTransport;
};
