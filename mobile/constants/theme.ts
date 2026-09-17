import { Easing } from "react-native-reanimated";
import { DynamicColorIOS, PlatformColor, type ColorValue } from "react-native";

import type { Medicine } from "@/constants/medicines";

/*
 * Medora design rules (appllama-app-design-skill), palette shared with the web landing:
 * - One accent, locked: `accent` (Medora purple). Status hues are semantic, never decorative.
 * - Primary actions are ink pills (`primary`), like the web "Caută" / "Creează cont" buttons.
 * - One warm grey family: every neutral is derived from ink #181817 on paper #FBFAF7.
 * - Shape lock: cards 20, icon tiles 12, inline tags 6, actions and chips are pills. Always continuous.
 * - Liquid Glass only on controls floating over content (tab bar, toolbars, sheets, floating buttons).
 * - 4pt spacing grid, flex gap over margins.
 */

const ios = process.env.EXPO_OS === "ios";

function system(iosName: string, fallback: string): ColorValue {
  return ios ? PlatformColor(iosName) : fallback;
}

function dynamic(light: string, dark: string): ColorValue {
  return ios ? DynamicColorIOS({ light, dark }) : light;
}

export const Brand = {
  ink: "#181817",
  paper: "#FBFAF7",
  pink: "#F2A8CF",
  purple: "#9567BF",
};

export const Colors = {
  // Darkened in light mode so purple text and icons pass 4.5:1 on paper.
  accent: dynamic("#8656B3", "#C49BEA"),
  primary: dynamic(Brand.ink, "#FFFDFA"),
  onPrimary: dynamic("#FFFDFA", Brand.ink),
  label: dynamic(Brand.ink, "#FFFFFF"),
  secondaryLabel: dynamic("rgba(24, 24, 23, 0.62)", "rgba(235, 235, 245, 0.62)"),
  tertiaryLabel: dynamic("rgba(24, 24, 23, 0.42)", "rgba(235, 235, 245, 0.34)"),
  background: dynamic("#F5F2EC", "#000000"),
  surface: dynamic("#FFFDFA", "#1C1C1E"),
  fill: dynamic("rgba(24, 24, 23, 0.06)", "rgba(120, 120, 128, 0.24)"),
  separator: dynamic("rgba(24, 24, 23, 0.12)", "rgba(84, 84, 88, 0.6)"),
};

export const Radii = {
  card: 20,
  tile: 12,
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
