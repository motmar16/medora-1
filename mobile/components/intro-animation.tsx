import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated, {
  Easing,
  type SharedValue,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { PowBurst } from "@/components/pow-effect";
import { Brand, Colors, Space } from "@/constants/theme";

const WORD = "medora";
const DROP_FROM = -190;
const LAND_AT = 560; // ms — when the flacon reaches the ground
const EXIT_AT = 1950; // ms — when the intro dissolves into the app

// Soft colour fields that drift behind everything, blurred into a single wash.
const BLOBS = [
  { color: Brand.pink, size: 300, x: -70, y: -150, drift: 26, delay: 0 },
  { color: Brand.purple, size: 340, x: 90, y: -40, drift: -34, delay: 400 },
  { color: "#A5D6FF", size: 320, x: -40, y: 130, drift: 30, delay: 800 },
  { color: "#FEEEAF", size: 260, x: 120, y: 190, drift: -22, delay: 1200 },
];

function Blob({
  blob,
  tiltX,
  tiltY,
  still,
}: {
  blob: (typeof BLOBS)[number];
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  still: boolean;
}) {
  const drift = useSharedValue(0);

  useEffect(() => {
    if (still) return;
    drift.set(
      withDelay(
        blob.delay,
        withRepeat(withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }), -1, true)
      )
    );
  }, [drift, blob.delay, still]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: blob.x + drift.get() * blob.drift + tiltX.get() * 1.6 },
      { translateY: blob.y + drift.get() * -blob.drift * 0.6 + tiltY.get() * 1.6 },
      { scale: 1 + drift.get() * 0.08 },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: blob.size,
          height: blob.size,
          borderRadius: blob.size / 2,
          backgroundColor: blob.color,
          opacity: 0.55,
        },
        style,
      ]}
    />
  );
}

/**
 * Launch intro for people without an account: the flacon drops in with weight,
 * squashes as it lands, kicks out a burst, and the wordmark springs in letter by
 * letter — then the whole thing dissolves into the app.
 */
export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const dark = useColorScheme() === "dark";
  const reduceMotion = useReducedMotion();
  const [burst, setBurst] = useState(false);

  const overlay = useSharedValue(1);
  const drop = useSharedValue(reduceMotion ? 0 : DROP_FROM);
  const squashX = useSharedValue(1);
  const squashY = useSharedValue(1);
  const float = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const letters = WORD.split("").map(() => useSharedValue(reduceMotion ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      overlay.set(withDelay(420, withTiming(0, { duration: 200 }, (done) => done && runOnJS(onDone)())));
      return;
    }

    // Fall with weight, then overshoot and settle.
    drop.set(withSpring(0, { mass: 1.1, damping: 12, stiffness: 150, velocity: 0 }));

    // Squash on impact, stretch back: the classic bit of cartoon weight.
    squashY.set(
      withDelay(
        LAND_AT,
        withSequence(
          withTiming(0.82, { duration: 90, easing: Easing.out(Easing.quad) }),
          withSpring(1, { mass: 0.6, damping: 6, stiffness: 320 })
        )
      )
    );
    squashX.set(
      withDelay(
        LAND_AT,
        withSequence(
          withTiming(1.16, { duration: 90, easing: Easing.out(Easing.quad) }),
          withSpring(1, { mass: 0.6, damping: 6, stiffness: 320 })
        )
      )
    );

    // Gentle levitation once it has settled, so it never looks frozen.
    float.set(withDelay(LAND_AT + 400, withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true)));

    letters.forEach((letter, index) => {
      letter.set(withDelay(LAND_AT + 160 + index * 55, withSpring(1, { mass: 0.7, damping: 10, stiffness: 220 })));
    });

    const land = setTimeout(() => {
      setBurst(true);
      if (process.env.EXPO_OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, LAND_AT);

    const finish = setTimeout(() => {
      if (process.env.EXPO_OS === "ios") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      overlay.set(withTiming(0, { duration: 360, easing: Easing.out(Easing.quad) }, (done) => done && runOnJS(onDone)()));
    }, EXIT_AT);

    return () => {
      clearTimeout(land);
      clearTimeout(finish);
    };
  }, [drop, squashX, squashY, float, letters, overlay, onDone, reduceMotion]);

  // Tilt parallax: the scene leans with the device, the way a real object would.
  // Loaded lazily so a build without the sensors module still shows the intro.
  useEffect(() => {
    if (reduceMotion) return;
    let subscription: { remove: () => void } | undefined;
    // Only touch expo-sensors when the running build actually links it; importing it
    // in a build without the native module throws.
    try {
      const DeviceMotion = require("expo-sensors/build/DeviceMotion")?.DeviceMotion;
      if (!DeviceMotion) return;
      Promise.resolve()
        .then(() => DeviceMotion.isAvailableAsync())
        .then((available: boolean) => {
          if (!available) return;
          DeviceMotion.setUpdateInterval(60);
          subscription = DeviceMotion.addListener(({ rotation }: { rotation?: { gamma: number; beta: number } }) => {
            if (!rotation) return;
            tiltX.set(withSpring(Math.max(-1, Math.min(1, rotation.gamma)) * 14, { damping: 18, stiffness: 90 }));
            tiltY.set(withSpring(Math.max(-1, Math.min(1, rotation.beta)) * 10, { damping: 18, stiffness: 90 }));
          });
        })
        .catch(() => {});
    } catch (e) {
      // Safe fallback if module cannot be resolved
    }
    return () => subscription?.remove();
  }, [tiltX, tiltY, reduceMotion]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.get() }));

  const flaconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tiltX.get() * 0.5 },
      { translateY: drop.get() + float.get() * -10 + tiltY.get() * 0.4 },
      { scaleX: squashX.get() },
      { scaleY: squashY.get() },
      { rotateZ: `${tiltX.get() * 0.12}deg` },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        StyleSheet.absoluteFill,
        overlayStyle,
        { backgroundColor: dark ? "#050505" : Brand.paper, alignItems: "center", justifyContent: "center" },
      ]}
    >
      <View style={StyleSheet.absoluteFill}>
        <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
          {BLOBS.map((blob) => (
            <Blob key={blob.color} blob={blob} tiltX={tiltX} tiltY={tiltY} still={reduceMotion} />
          ))}
        </View>
        {/* Blur turns the drifting circles into one soft field of colour. */}
        <BlurView intensity={dark ? 70 : 90} tint={dark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
      </View>

      <Animated.View style={flaconStyle}>
        <Image
          source={require("@/assets/images/capsule-hero.png")}
          style={{ width: 96, height: 138 }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
      <PowBurst trigger={burst} count={10} radius={62} />

      <View style={{ flexDirection: "row", marginTop: Space.xl }}>
        {WORD.split("").map((letter, index) => (
          <Letter key={index} letter={letter} progress={letters[index]} />
        ))}
      </View>
    </Animated.View>
  );
}

function Letter({ letter, progress }: { letter: string; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ translateY: (1 - progress.get()) * 22 }, { scale: 0.7 + progress.get() * 0.3 }],
  }));

  return (
    <Animated.Text
      style={[
        { fontSize: 34, fontWeight: "700", letterSpacing: -1, color: Colors.label },
        style,
      ]}
    >
      {letter}
    </Animated.Text>
  );
}
