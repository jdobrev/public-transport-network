import { FilterViewTypeValue, filterSlice } from "./filterSlice";
import { useAppDispatch, useAppSelector } from "./store";

export const useViewType = () => {
  const viewType = useAppSelector((state) => state.filter.viewType);
  const dispatch = useAppDispatch();
  const setViewType = (viewType: FilterViewTypeValue) => {
    dispatch(filterSlice.actions.setViewType(viewType));
  };

  return {
    viewType,
    setViewType,
  };
};
