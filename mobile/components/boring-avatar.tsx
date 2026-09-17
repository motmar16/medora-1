import React, { useMemo } from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

const SIZE = 36;

/**
 * Curated color palettes tuned to Medora aesthetic:
 * Medical sky blue (#ACDAFD), signature purple (#8656B3), calming sage (#8FA99A),
 * warm peach/coral (#F4A261), soft rose (#F2A8CF), clinical linen (#F3E6D4).
 */
export const MEDORA_PALETTES = [
  // 0. Medora Brand Signature
  ["#8656B3", "#ACDAFD", "#F2A8CF", "#8FA99A", "#F4A261"],
  // 1. Clinical Calm (Azure & Mint)
  ["#2F6FD6", "#ACDAFD", "#F3E6D4", "#52B788", "#4A8BD4"],
  // 2. Warm Pharmacy & Herb
  ["#E76F51", "#F4A261", "#E9C46A", "#2A9D8F", "#5FA8D3"],
  // 3. Gentle Lavender & Peach
  ["#9567BF", "#F8AD9D", "#FBC4AB", "#68D8D6", "#07B1CA"],
  // 4. Nordic Mineral Health
  ["#3D5A80", "#98C1D9", "#E0FBFC", "#EE6C4D", "#293241"],
];

function hashCode(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getDigit(number: number, ntn: number): number {
  return Math.floor((number / Math.pow(10, ntn)) % 10);
}

function getBoolean(number: number, ntn: number): boolean {
  return !(getDigit(number, ntn) % 2);
}

function getUnit(number: number, range: number, index?: number): number {
  const value = number % range;
  if (index && getDigit(number, index) % 2 === 0) {
    return -value;
  }
  return value;
}

function getRandomColor(number: number, colors: string[], range: number): string {
  return colors[number % range];
}

function getContrast(hexcolor: string): string {
  let hex = hexcolor;
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#181817" : "#FFFFFF";
}

function generateBeamData(name: string, colors: string[]) {
  const numFromName = hashCode(name);
  const range = colors.length;
  const wrapperColor = getRandomColor(numFromName, colors, range);
  const preTranslateX = getUnit(numFromName, 10, 1);
  const wrapperTranslateX = preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX;
  const preTranslateY = getUnit(numFromName, 10, 2);
  const wrapperTranslateY = preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY;

  return {
    wrapperColor,
    faceColor: getContrast(wrapperColor),
    backgroundColor: getRandomColor(numFromName + 13, colors, range),
    wrapperTranslateX,
    wrapperTranslateY,
    wrapperRotate: getUnit(numFromName, 360),
    wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
    isMouthOpen: getBoolean(numFromName, 2),
    isCircle: getBoolean(numFromName, 1),
    eyeSpread: getUnit(numFromName, 5),
    mouthSpread: getUnit(numFromName, 3),
    faceRotate: getUnit(numFromName, 10, 3),
    faceTranslateX:
      wrapperTranslateX > SIZE / 6 ? wrapperTranslateX / 2 : getUnit(numFromName, 8, 1),
    faceTranslateY:
      wrapperTranslateY > SIZE / 6 ? wrapperTranslateY / 2 : getUnit(numFromName, 7, 2),
  };
}

export interface BoringAvatarProps {
  name?: string;
  email?: string;
  size?: number;
  variant?: "beam";
  colors?: string[];
  square?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Native implementation of Boring Avatars "beam" variant with curated Medora palettes.
 * 100% native Views, zero external dependencies, 120 FPS hardware acceleration.
 */
export function BoringAvatar({
  name = "Medora",
  email,
  size = 72,
  colors,
  square = false,
  style,
}: BoringAvatarProps) {
  const seed = email || name || "Medora";

  const palette = useMemo(() => {
    if (colors && colors.length > 0) return colors;
    const hash = hashCode(seed);
    return MEDORA_PALETTES[hash % MEDORA_PALETTES.length];
  }, [seed, colors]);

  const data = useMemo(() => generateBeamData(seed, palette), [seed, palette]);
  const borderRadius = square ? Math.round(size * 0.22) : size / 2;
  const s = size / SIZE;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          overflow: "hidden",
          backgroundColor: data.backgroundColor,
          position: "relative",
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Avatar pentru ${name}`}
    >
      {/* Background Wrapper (Body / Shape) */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          backgroundColor: data.wrapperColor,
          borderRadius: data.isCircle ? size : Math.round(size / 6),
          transform: [
            { translateX: data.wrapperTranslateX * s },
            { translateY: data.wrapperTranslateY * s },
            { rotate: `${data.wrapperRotate}deg` },
            { scale: data.wrapperScale },
          ],
        }}
      />

      {/* Face Features Group */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          transform: [
            { translateX: data.faceTranslateX * s },
            { translateY: data.faceTranslateY * s },
            { rotate: `${data.faceRotate}deg` },
          ],
        }}
      >
        {/* Left Eye */}
        <View
          style={{
            position: "absolute",
            left: (14 - data.eyeSpread) * s,
            top: 14 * s,
            width: Math.max(1.8, 1.8 * s),
            height: Math.max(2.4, 2.4 * s),
            borderRadius: 1.2 * s,
            backgroundColor: data.faceColor,
          }}
        />

        {/* Right Eye */}
        <View
          style={{
            position: "absolute",
            left: (20 + data.eyeSpread) * s,
            top: 14 * s,
            width: Math.max(1.8, 1.8 * s),
            height: Math.max(2.4, 2.4 * s),
            borderRadius: 1.2 * s,
            backgroundColor: data.faceColor,
          }}
        />

        {/* Mouth */}
        {data.isMouthOpen ? (
          <View
            style={{
              position: "absolute",
              left: 14.5 * s,
              top: (19 + data.mouthSpread) * s,
              width: 7 * s,
              height: 3.5 * s,
              borderBottomWidth: Math.max(1.5, 1.5 * s),
              borderColor: data.faceColor,
              borderBottomLeftRadius: 3.5 * s,
              borderBottomRightRadius: 3.5 * s,
            }}
          />
        ) : (
          <View
            style={{
              position: "absolute",
              left: 13 * s,
              top: (19 + data.mouthSpread) * s,
              width: 10 * s,
              height: 4.5 * s,
              backgroundColor: data.faceColor,
              borderBottomLeftRadius: 5 * s,
              borderBottomRightRadius: 5 * s,
            }}
          />
        )}
      </View>

      {/* Subtle tactile outer border rim */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.08)",
          },
        ]}
      />
    </View>
  );
}

export { BoringAvatar as MeshAvatar };
