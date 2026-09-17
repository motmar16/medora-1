import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Motion } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableScaleProps = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
};

// Press feedback for cards and buttons: scale 0.97 on press-in, strong ease-out.
// With Reduce Motion the spatial scale collapses to an opacity dip.
export function PressableScale({ style, onPressIn, onPressOut, ...props }: PressableScaleProps) {
  const reduceMotion = useReducedMotion();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const p = pressed.get();
    return reduceMotion
      ? { opacity: interpolate(p, [0, 1], [1, 0.6]) }
      : { transform: [{ scale: interpolate(p, [0, 1], [1, Motion.pressScale]) }] };
  });

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event) => {
        pressed.set(withTiming(1, { duration: Motion.pressIn, easing: Motion.easeOut }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withTiming(0, { duration: Motion.pressOut, easing: Motion.easeOut }));
        onPressOut?.(event);
      }}
      style={[style, animatedStyle]}
    />
  );
}
