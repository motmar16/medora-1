import { Easing } from "react-native-reanimated";
import { PlatformColor, type ColorValue } from "react-native";

import type { Medicine } from "@/constants/medicines";

/*
 * Medora design rules (appllama-app-design-skill):
 * - One accent, locked: `accent`. Status hues are semantic, never decorative.
 * - Surfaces and greys come from iOS semantic colors only (light + dark for free).
 * - Shape lock: cards 20, inline tags 6, actions and chips are pills. Always continuous.
 * - Liquid Glass only on controls floating over content (tab bar, toolbars, floating buttons).
 * - 4pt spacing grid, flex gap over margins.
 */

const ios = process.env.EXPO_OS === "ios";

function system(iosName: string, fallback: string): ColorValue {
  return ios ? PlatformColor(iosName) : fallback;
}

export const Colors = {
  accent: "#1d7ed2",
  onAccent: "#ffffff",
  label: system("label", "#1c1b1f"),
  secondaryLabel: system("secondaryLabel", "#49454f"),
  tertiaryLabel: system("tertiaryLabel", "#79747e"),
  background: system("systemGroupedBackground", "#f3f2f7"),
  surface: system("secondarySystemGroupedBackground", "#ffffff"),
  fill: system("tertiarySystemFill", "#e7e6ec"),
  separator: system("separator", "#cac4d0"),
};

export const Radii = {
  card: 20,
  tag: 6,
  pill: 999,
};

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const Type = {
  title1: { fontSize: 28, fontWeight: "700", letterSpacing: 0.36 },
  title3: { fontSize: 20, fontWeight: "600", letterSpacing: 0.38 },
  headline: { fontSize: 17, fontWeight: "600", letterSpacing: -0.41 },
  body: { fontSize: 17, fontWeight: "400", letterSpacing: -0.41 },
  callout: { fontSize: 16, fontWeight: "400", letterSpacing: -0.32 },
  subhead: { fontSize: 15, fontWeight: "400", letterSpacing: -0.24 },
  footnote: { fontSize: 13, fontWeight: "400", letterSpacing: -0.08 },
  caption: { fontSize: 12, fontWeight: "400", letterSpacing: 0 },
} as const;

// Motion vocabulary: strong ease-out, press lands in 120ms, release settles in 200ms.
export const Motion = {
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),
  pressIn: 120,
  pressOut: 200,
  pressScale: 0.97,
};

type Status = Medicine["status"];

export const StatusStyle: Record<
  Status,
  { label: string; symbol: string; color: ColorValue }
> = {
  temporary: {
    label: "Ruptură temporară",
    symbol: "exclamationmark.triangle.fill",
    color: system("systemOrange", "#f57c00"),
  },
  permanent: {
    label: "Retragere definitivă",
    symbol: "xmark.octagon.fill",
    color: system("systemRed", "#d32f2f"),
  },
  resumed: {
    label: "Comercializare reluată",
    symbol: "arrow.clockwise.circle.fill",
    color: system("systemTeal", "#00897b"),
  },
  available: {
    label: "Disponibil",
    symbol: "checkmark.circle.fill",
    color: system("systemGreen", "#388e3c"),
  },
  unknown: {
    label: "Status necunoscut",
    symbol: "questionmark.circle.fill",
    color: system("systemGray", "#757575"),
  },
};
