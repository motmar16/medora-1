import React, { useEffect } from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

const WIDTH = 260;
const HEIGHT = 48;

// Anatomically accurate ECG baseline and QRS complex points (width: 260, center peak at x: 122)
export const ECG_POINTS = [
  { x: 0, y: 24 },
  { x: 68, y: 24 },
  { x: 78, y: 19 }, // P-wave rise
  { x: 88, y: 24 }, // P-wave return
  { x: 104, y: 24 }, // PR segment
  { x: 110, y: 28 }, // Q dip down
  { x: 122, y: 2 },  // R sharp cardiac peak
  { x: 132, y: 38 }, // S deep dip
  { x: 138, y: 24 }, // J-point return
  { x: 148, y: 24 }, // ST segment
  { x: 160, y: 16 }, // T-wave recovery
  { x: 176, y: 24 }, // T-wave return
  { x: 260, y: 24 }, // Isoelectric baseline
];

// Precompute segments for 0 overhead at runtime
const SEGMENTS = (() => {
  const segs = [];
  let total = 0;
  for (let i = 0; i < ECG_POINTS.length - 1; i++) {
    const p1 = ECG_POINTS[i];
    const p2 = ECG_POINTS[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const cx = (p1.x + p2.x) / 2;
    const cy = (p1.y + p2.y) / 2;
    segs.push({
      p1,
      p2,
      len,
      angle,
      cx,
      cy,
      start: total,
      end: total + len,
    });
    total += len;
  }
  return { segs, total };
})();

interface ECGHorizonProps {
  reduceMotion?: boolean;
  progress: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
}

export function ECGHorizon({ reduceMotion = false, progress, style }: ECGHorizonProps) {
  // Keyframe arrays for Reanimated worklet interpolation
  const stepCount = 50;
  const inputT: number[] = [];
  const outputX: number[] = [];
  const outputY: number[] = [];

  for (let i = 0; i <= stepCount; i++) {
    const t = i / stepCount;
    const dist = t * SEGMENTS.total;
    let found = false;
    for (const seg of SEGMENTS.segs) {
      if (dist <= seg.end || seg === SEGMENTS.segs[SEGMENTS.segs.length - 1]) {
        const segT = Math.max(0, Math.min(1, (dist - seg.start) / seg.len));
        inputT.push(t);
        outputX.push(seg.p1.x + (seg.p2.x - seg.p1.x) * segT);
        outputY.push(seg.p1.y + (seg.p2.y - seg.p1.y) * segT);
        found = true;
        break;
      }
    }
  }

  // Glowing pulse head that traces the exact ECG contour
  const pulseDotStyle = useAnimatedStyle(() => {
    if (reduceMotion) return { opacity: 0 };
    const x = interpolate(progress.value, inputT, outputX);
    const y = interpolate(progress.value, inputT, outputY);
    // Fade in at start, fade out at end
    const opacity = interpolate(progress.value, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

    return {
      transform: [{ translateX: x - 4 }, { translateY: y - 4 }],
      opacity,
    };
  });

  // Trail ghost for optical persistence of vision
  const trailDotStyle = useAnimatedStyle(() => {
    if (reduceMotion) return { opacity: 0 };
    const trailT = Math.max(0, progress.value - 0.035);
    const x = interpolate(trailT, inputT, outputX);
    const y = interpolate(trailT, inputT, outputY);
    const opacity = interpolate(trailT, [0, 0.08, 0.92, 1], [0, 0.5, 0.5, 0]);

    return {
      transform: [{ translateX: x - 3 }, { translateY: y - 3 }],
      opacity,
    };
  });

  // Soft cardiac resonance ripple when pulse hits the R-peak (t ~ 0.44)
  const peakRippleStyle = useAnimatedStyle(() => {
    if (reduceMotion) return { opacity: 0 };
    const p = progress.value;
    // Peak is between 0.41 and 0.55
    const rippleScale = interpolate(p, [0.42, 0.54], [0.5, 2.6], "clamp");
    const rippleOpacity = interpolate(p, [0.42, 0.45, 0.54], [0, 0.55, 0], "clamp");

    return {
      transform: [{ scale: rippleScale }],
      opacity: rippleOpacity,
    };
  });

  return (
    <View style={[{ width: WIDTH, height: HEIGHT, position: "relative" }, style]}>
      {/* 1. Muted ECG Blueprint Track */}
      {SEGMENTS.segs.map((seg, idx) => (
        <View
          key={idx}
          style={{
            position: "absolute",
            left: seg.cx - seg.len / 2,
            top: seg.cy - 1,
            width: seg.len,
            height: 2,
            backgroundColor: "rgba(134, 86, 179, 0.22)",
            borderRadius: 1,
            transform: [{ rotate: `${seg.angle}deg` }],
          }}
        />
      ))}

      {/* 2. Cardiac Peak Resonance Ripple (at x: 122, y: 2) */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 122 - 12,
            top: 2 - 12,
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: "#8656B3",
            backgroundColor: "rgba(172, 218, 253, 0.2)",
          },
          peakRippleStyle,
        ]}
      />

      {/* 3. Trailing Ghost Head */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: "rgba(172, 218, 253, 0.9)",
          },
          trailDotStyle,
        ]}
      />

      {/* 4. Active Glowing Pulse Head (Leader) */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#8656B3",
            shadowColor: "#8656B3",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 5,
          },
          pulseDotStyle,
        ]}
      />
    </View>
  );
}
