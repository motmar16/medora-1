import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import Animated from "react-native-reanimated";

import { PowBurst, usePowSpring } from "@/components/pow-effect";
import { PressableScale } from "@/components/pressable-scale";
import { Colors } from "@/constants/theme";
import { useWatchlist } from "@/store/watchlist";

export function BookmarkButton({ id }: { id: string }) {
  const saved = useWatchlist((state) => state.ids.includes(id));
  const toggle = useWatchlist((state) => state.toggle);
  const [burstKey, setBurstKey] = useState(0);
  const { pop, animatedStyle } = usePowSpring();

  const handlePress = () => {
    const nextSaved = !saved;
    if (process.env.EXPO_OS === "ios") {
      if (nextSaved) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    if (nextSaved) {
      pop();
      setBurstKey((k) => k + 1);
    }
    toggle(id);
  };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={saved ? "Nu mai urmări" : "Urmărește"}
      accessibilityState={{ selected: saved }}
      hitSlop={8}
      onPress={handlePress}
      style={{ width: 38, height: 38, alignItems: "center", justifyContent: "center", position: "relative" }}
    >
      <Animated.View style={animatedStyle}>
        <SymbolView
          name={saved ? "bookmark.fill" : "bookmark"}
          size={20}
          tintColor={saved ? Colors.accent : Colors.tertiaryLabel}
        />
      </Animated.View>
      <PowBurst key={burstKey} trigger={burstKey > 0} count={8} radius={26} />
    </PressableScale>
  );
}
