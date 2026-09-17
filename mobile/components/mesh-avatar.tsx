import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface MeshAvatarProps {
  name?: string;
  email?: string;
  size?: number;
  showInitials?: boolean;
}

const PALETTES = [
  { base: "#F3E6D4", c1: "#3574D8", c2: "#EC8150", c3: "#94AC9F" },
  { base: "#F6E7D5", c1: "#2F6FD6", c2: "#F27A45", c3: "#A3B8AD" },
  { base: "#EAE0D3", c1: "#1E65D6", c2: "#E67B48", c3: "#7EA695" },
  { base: "#DFE8E2", c1: "#3A68B8", c2: "#F48C62", c3: "#689B84" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name?: string) {
  if (!name) return "M";
  return name
    .split(/\s+/)
    .filter((part) => /\p{L}/u.test(part[0] ?? ""))
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function MeshAvatar({ name = "Medora", email = "", size = 72, showInitials = true }: MeshAvatarProps) {
  const seed = useMemo(() => hashString(email || name), [email, name]);
  const palette = PALETTES[seed % PALETTES.length];
  const initials = useMemo(() => getInitials(name), [name]);

  // Micro jitter of spots based on seed
  const r1 = 0.55 * size;
  const r2 = 0.50 * size;
  const r3 = 0.48 * size;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        backgroundColor: palette.base,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* 3 Organic Colored Blobs */}
      <View
        style={{
          position: "absolute",
          width: r1 * 2,
          height: r1 * 2,
          borderRadius: r1,
          backgroundColor: palette.c1,
          top: -r1 * 0.4,
          left: -r1 * 0.5,
          opacity: 0.88,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: r2 * 2,
          height: r2 * 2,
          borderRadius: r2,
          backgroundColor: palette.c2,
          top: -r2 * 0.3,
          right: -r2 * 0.4,
          opacity: 0.85,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: r3 * 2,
          height: r3 * 2,
          borderRadius: r3,
          backgroundColor: palette.c3,
          bottom: -r3 * 0.4,
          right: -r3 * 0.2,
          opacity: 0.82,
        }}
      />

      {/* Hardware-accelerated GPU Blur */}
      <BlurView intensity={55} tint="light" style={StyleSheet.absoluteFill} />

      {/* Subtle inner highlight rim */}
      <View
        style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.45)",
        }}
      />

      {showInitials && (
        <Text
          style={{
            fontSize: Math.round(size * 0.38),
            fontWeight: "700",
            color: "#1a2b4c",
            letterSpacing: -0.5,
            textShadowColor: "rgba(255, 255, 255, 0.5)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}
