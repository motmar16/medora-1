import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import {
  Alignment,
  Fit,
  RiveView,
  useRive,
  useRiveFile,
} from "@rive-app/react-native";

import { Colors } from "@/constants/theme";

interface RiveBookmarkButtonProps {
  saved: boolean;
  onToggle: () => void;
  size?: number;
}

export function RiveBookmarkButton({
  saved,
  onToggle,
  size = 36,
}: RiveBookmarkButtonProps) {
  const { riveFile, isLoading } = useRiveFile(
    require("@/assets/rive/icons.riv")
  );
  const { riveViewRef, setHybridRef } = useRive();

  // Sync the Rive State Machine boolean input "active" whenever saved changes
  useEffect(() => {
    if (riveViewRef) {
      try {
        riveViewRef.setBooleanInputValue("active", saved);
        riveViewRef.playIfNeeded();
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [saved, riveViewRef]);

  const handlePress = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(
        saved
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
    }
    onToggle();
  };

  if (isLoading || !riveFile) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={saved ? "Șterge din Lista mea" : "Adaugă în Lista mea"}
        accessibilityState={{ selected: saved }}
        onPress={handlePress}
        hitSlop={8}
        style={({ pressed }) => [
          styles.container,
          { width: size, height: size, opacity: pressed ? 0.75 : 1 },
        ]}
      >
        <SymbolView
          name={saved ? "bookmark.fill" : "bookmark"}
          size={Math.round(size * 0.6)}
          tintColor={saved ? Colors.accent : Colors.tertiaryLabel}
        />
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? "Șterge din Lista mea" : "Adaugă în Lista mea"}
      accessibilityState={{ selected: saved }}
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.container,
        { width: size, height: size, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <RiveView
        hybridRef={setHybridRef}
        file={riveFile}
        artboardName="LIKE/STAR"
        stateMachineName="STAR_Interactivity"
        fit={Fit.Contain}
        alignment={Alignment.Center}
        autoPlay={true}
        style={{ width: size, height: size }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
