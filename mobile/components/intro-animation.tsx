import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

import { useAmbientBackground } from "@/components/ambient-background";
import { ECGHorizon } from "@/components/ecg-horizon";
import { Colors, Motion, Space } from "@/constants/theme";

const HOLD = 900;
const FADE = 320;

/**
 * Short brand intro shown once per app launch while nobody is signed in.
 * It sits on the same ambient background as the screen underneath, so it
 * dissolves into the app instead of cutting to it.
 */
export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const background = useAmbientBackground();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(
      withDelay(
        reduceMotion ? 260 : HOLD,
        withTiming(0, { duration: reduceMotion ? 160 : FADE, easing: Motion.easeOut }, (finished) => {
          if (finished) runOnJS(onDone)();
        })
      )
    );
  }, [opacity, onDone, reduceMotion]);

  const fade = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        background,
        fade,
        { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
      ]}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          entering={reduceMotion ? FadeIn.duration(220) : FadeIn.duration(420).delay(120)}
          style={{ position: "absolute", top: 46 }}
        >
          <ECGHorizon />
        </Animated.View>

        <Animated.View
          entering={
            reduceMotion
              ? FadeIn.duration(220)
              : ZoomIn.springify().damping(14).stiffness(140).withInitialValues({ transform: [{ scale: 0.72 }] })
          }
        >
          <Image
            source={require("@/assets/images/capsule-hero.png")}
            style={{ width: 84, height: 120 }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </Animated.View>
      </View>

      <Animated.Text
        entering={
          reduceMotion
            ? FadeIn.duration(220)
            : FadeInDown.duration(460).delay(280).easing(Easing.out(Easing.quad))
        }
        maxFontSizeMultiplier={1.3}
        style={{
          marginTop: Space.xl,
          fontSize: 30,
          fontWeight: "700",
          letterSpacing: -0.9,
          color: Colors.label,
        }}
      >
        medora
      </Animated.Text>
    </Animated.View>
  );
}
