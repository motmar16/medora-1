import { View, type ViewProps } from "react-native";

import { Colors, Radii, Space } from "@/constants/theme";

export const cardStyle = {
  backgroundColor: Colors.surface,
  borderRadius: Radii.card,
  borderCurve: "continuous",
  padding: Space.lg,
  gap: Space.md,
} as const;

export function Card({ style, ...props }: ViewProps) {
  return <View {...props} style={[cardStyle, style]} />;
}
