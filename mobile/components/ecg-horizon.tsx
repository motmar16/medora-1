import React, { useEffect } from "react";
import { View, useColorScheme, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const CONTAINER_WIDTH = 320;
const CONTAINER_HEIGHT = 52;
const CYCLE_WIDTH = 160;
const NUM_CYCLES = 4;

// Normal Sinus Rhythm (NSR) ECG keyframe points for one 160px cycle
const CYCLE_POINTS = [
  { x: 0, y: 25 },
  { x: 36, y: 25 },   // Isoelectric baseline
  { x: 46, y: 20 },   // P-wave crest
  { x: 56, y: 25 },   // P-wave return
  { x: 70, y: 25 },   // PR interval baseline
  { x: 76, y: 29 },   // Q negative deflection
  { x: 86, y: 6 },    // R sharp positive peak (tallest cardiac spike)
  { x: 94, y: 43 },   // S deep negative plunge
  { x: 102, y: 25 },  // J-point return to baseline
  { x: 114, y: 25 },  // ST segment baseline
  { x: 126, y: 17 },  // T-wave ventricular repolarization
  { x: 138, y: 25 },  // T-wave return
  { x: 160, y: 25 },  // Baseline to end of cycle
];

// Precompute the 48 segments and peak beads across 4 continuous cycles
const { SEGMENTS, PEAK_DOTS } = (() => {
  const segs = [];
  const peaks = [];
  for (let c = 0; c < NUM_CYCLES; c++) {
    const xOffset = c * CYCLE_WIDTH;
    for (let i = 0; i < CYCLE_POINTS.length - 1; i++) {
      const p1 = { x: CYCLE_POINTS[i].x + xOffset, y: CYCLE_POINTS[i].y };
      const p2 = { x: CYCLE_POINTS[i + 1].x + xOffset, y: CYCLE_POINTS[i + 1].y };
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy) + 0.8; // Subpixel joint overlap
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;
      segs.push({ cx, cy, len, angle });
    }
    peaks.push({ x: 86 + xOffset, y: 6 });
  }
  return { SEGMENTS: segs, PEAK_DOTS: peaks };
})();

interface ECGHorizonProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  glowColor?: string;
}

export function ECGHorizon({
  style,
  color = "#8656B3",
  glowColor = "rgba(134, 86, 179, 0.35)",
}: ECGHorizonProps) {
  const isDark = useColorScheme() === "dark";
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
    // Seamless infinite horizontal scroll: moves by exactly one cycle (-160px) in 1200ms
    // and repeats forever with 0ms reset so it never freezes
    translateX.value = withRepeat(
      withSequence(
        withTiming(-CYCLE_WIDTH, { duration: 1200, easing: Easing.linear }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  }, [translateX]);

  const animatedWaveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Edge fade colors matching screen backdrop
  const fadeBg = isDark ? "rgba(5, 5, 5," : "rgba(251, 250, 247,";

  return (
    <View
      style={[
        {
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT,
          borderRadius: CONTAINER_HEIGHT / 2,
          overflow: "hidden",
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(134, 86, 179, 0.04)",
          borderWidth: 1,
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(134, 86, 179, 0.15)",
          position: "relative",
          justifyContent: "center",
        },
        style,
      ]}
      pointerEvents="none"
      accessibilityRole="image"
      accessibilityLabel="Monitor ritm cardiac ECG activ"
    >
      {/* Moving Waveform Track (4 contiguous cycles) */}
      <Animated.View
        style={[
          {
            width: CYCLE_WIDTH * NUM_CYCLES,
            height: CONTAINER_HEIGHT,
            position: "absolute",
            left: 0,
            top: 0,
          },
          animatedWaveStyle,
        ]}
      >
        {/* Layer 1: Ambient Luminous Glow Underlay */}
        {SEGMENTS.map((seg, idx) => (
          <View
            key={`glow-${idx}`}
            style={{
              position: "absolute",
              left: seg.cx - seg.len / 2,
              top: seg.cy - 2,
              width: seg.len,
              height: 4.5,
              borderRadius: 2.25,
              backgroundColor: glowColor,
              transform: [{ rotate: `${seg.angle}deg` }],
            }}
          />
        ))}

        {/* Layer 2: Sharp Crisp Cardiac Core Line */}
        {SEGMENTS.map((seg, idx) => (
          <View
            key={`core-${idx}`}
            style={{
              position: "absolute",
              left: seg.cx - seg.len / 2,
              top: seg.cy - 1.2,
              width: seg.len,
              height: 2.4,
              borderRadius: 1.2,
              backgroundColor: color,
              transform: [{ rotate: `${seg.angle}deg` }],
            }}
          />
        ))}

        {/* Layer 3: Radiant R-Peak Beads */}
        {PEAK_DOTS.map((pt, idx) => (
          <View
            key={`peak-${idx}`}
            style={{
              position: "absolute",
              left: pt.x - 7,
              top: pt.y - 7,
              width: 14,
              height: 14,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Halo */}
            <View
              style={{
                position: "absolute",
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "rgba(172, 218, 253, 0.45)",
              }}
            />
            {/* Spark Bead */}
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#FFFFFF",
                borderWidth: 1.5,
                borderColor: color,
              }}
            />
          </View>
        ))}
      </Animated.View>

      {/* Left Edge Holographic Fade Mask */}
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 36,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.95)` }} />
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.75)` }} />
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.50)` }} />
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.25)` }} />
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.08)` }} />
      </View>

      {/* Right Edge Holographic Fade Mask */}
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 36,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.08)` }} />
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.25)` }} />
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.50)` }} />
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.75)` }} />
        <View style={{ flex: 1, backgroundColor: `${fadeBg} 0.95)` }} />
      </View>
    </View>
  );
}
