import { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  runOnUI,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "./useThemeColor";
import { View } from "@/components/View";

const DEFAULT_HEADER_HEIGHT = 40;
const COLLAPSED_HEIGHT = 0;

const COLLAPSED = 1;
const EXPANDED = 0;

const EXPAND_THRESHOLD = 16; // pixels to scroll up before expanding
const ANIMATION_DURATION = 150;

export function useCollapsibleHeader(headerHeight = DEFAULT_HEADER_HEIGHT) {
  const backgroundColor = useThemeColor({}, "background");
  const { top } = useSafeAreaInsets();

  const headerState = useSharedValue(EXPANDED);
  const prevScrollY = useSharedValue(0);

  const expand = () => {
    "worklet";
    headerState.value = withTiming(EXPANDED, {
      duration: ANIMATION_DURATION,
    });
  };
  const collapse = () => {
    "worklet";
    headerState.value = withTiming(COLLAPSED, {
      duration: ANIMATION_DURATION,
    });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      if (y > prevScrollY.value && y > headerHeight) {
        // Scrolling down
        collapse();
      } else if (
        y < prevScrollY.value &&
        (prevScrollY.value - y > EXPAND_THRESHOLD || y < EXPAND_THRESHOLD * 2)
      ) {
        // Scrolling up
        expand();
      }
      prevScrollY.value = y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height:
        headerHeight - (headerHeight - COLLAPSED_HEIGHT) * headerState.value,
    };
  });

  // Placeholder for the header to account for absolute position
  // Place inside scrollable content
  const PlaceholderHeader = ({
    style,
    ...props
  }: ComponentProps<typeof View>) => (
    <View
      {...props}
      style={[
        {
          height: headerHeight,
          backgroundColor,
        },
        style,
      ]}
    />
  );

  const Header = ({ children, style }: ComponentProps<Animated.View>) => (
    <>
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
    PlaceholderHeader,
    scrollHandler,
    expand: runOnUI(expand),
    collapse: runOnUI(collapse),
    headerHeight,
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
