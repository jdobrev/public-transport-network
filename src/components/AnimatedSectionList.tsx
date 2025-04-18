import { SectionList, SectionListProps, SectionListData } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";
import type { SectionList as RNSectionList } from "react-native";

type ReanimatedSectionListProps<
  ItemT,
  SectionT extends SectionListData<ItemT> = SectionListData<ItemT>
> = AnimatedProps<SectionListProps<ItemT, SectionT>>;

type AnimatedSectionListType = <
  ItemT,
  SectionT extends SectionListData<ItemT> = SectionListData<ItemT>
>(
  props: ReanimatedSectionListProps<ItemT, SectionT> & {
    ref?: React.Ref<RNSectionList<ItemT, SectionT>>;
  }
) => React.ReactElement | null;

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList
) as unknown as AnimatedSectionListType;

export default AnimatedSectionList;
