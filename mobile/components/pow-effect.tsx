import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface ParticleProps {
  index: number;
  total: number;
  trigger: boolean;
  color?: string;
  radius?: number;
}

function Particle({ index, total, trigger, color = "#8656B3", radius = 32 }: ParticleProps) {
  const progress = useSharedValue(0);

  const angle = (index / total) * Math.PI * 2 + (index % 2 === 0 ? 0.2 : -0.2);
  const targetX = Math.cos(angle) * (radius + (index % 2) * 8);
  const targetY = Math.sin(angle) * (radius + (index % 2) * 8);

  useEffect(() => {
    if (trigger) {
      progress.value = 0;
      progress.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) });
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = progress.value < 0.2 
      ? progress.value / 0.2 
      : 1 - (progress.value - 0.2) / 0.8;

    return {
      transform: [
        { translateX: targetX * progress.value },
        { translateY: targetY * progress.value },
        { scale: Math.max(0, scale) },
      ],
      opacity: progress.value < 0.7 ? 1 : 1 - (progress.value - 0.7) / 0.3,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function PowBurst({
  trigger,
  colors = ["#8656B3", "#F2A8CF", "#4A8BD4", "#F5A623"],
  count = 7,
  radius = 28,
}: {
  trigger: boolean;
  colors?: string[];
  count?: number;
  radius?: number;
}) {
  if (!trigger) return null;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
      {Array.from({ length: count }).map((_, i) => (
        <Particle
          key={i}
          index={i}
          total={count}
          trigger={trigger}
          color={colors[i % colors.length]}
          radius={radius}
        />
      ))}
    </View>
  );
}

export function usePowSpring() {
  const scale = useSharedValue(1);

  const pop = () => {
    scale.value = withSequence(
      withSpring(1.38, { damping: 5, stiffness: 400 }),
      withSpring(1, { damping: 9, stiffness: 220 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { pop, animatedStyle };
}
