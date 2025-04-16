import { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "./useThemeColor";
import { View } from "@/components/View";

const DEFAULT_HEADER_HEIGHT = 40;
const COLLAPSED_HEIGHT = 0;

const COLLAPSED = 1;
const EXPANDED = 0;

export function useCollapsibleHeader() {
  const backgroundColor = useThemeColor({}, "background");
  const { top } = useSafeAreaInsets();
  const totalHeaderHeight = DEFAULT_HEADER_HEIGHT + top;

  const headerState = useSharedValue(EXPANDED);
  const prevScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      if (y > prevScrollY.value && y > DEFAULT_HEADER_HEIGHT) {
        // Scrolling down
        headerState.value = withTiming(COLLAPSED);
      } else if (y < prevScrollY.value) {
        // Scrolling up
        headerState.value = withTiming(EXPANDED);
      }
      prevScrollY.value = y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height:
        DEFAULT_HEADER_HEIGHT -
        (DEFAULT_HEADER_HEIGHT - COLLAPSED_HEIGHT) * headerState.value,
    };
  });

  const expand = () => (headerState.value = withTiming(EXPANDED));
  const collapse = () => (headerState.value = withTiming(COLLAPSED));

  const Header = ({ children, style }: ComponentProps<Animated.View>) => (
    <>
      <View style={{ height: totalHeaderHeight }} />
      <Animated.View
        style={[
          headerAnimatedStyle,
          styles.header,
          { top, backgroundColor },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </>
  );

  return {
    Header,
    scrollHandler,
    expand,
    collapse,
    HEADER_HEIGHT: DEFAULT_HEADER_HEIGHT,
    totalHeaderHeight,
  };
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
