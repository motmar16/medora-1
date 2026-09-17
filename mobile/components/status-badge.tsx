import { SymbolView, type SFSymbol } from "expo-symbols";
import { Text, View } from "react-native";

import type { Medicine } from "@/constants/medicines";
import { Colors, Radii, Space, StatusStyle, Type } from "@/constants/theme";

// Status reads through the symbol hue; the label stays in `label` color for contrast in both themes.
export function StatusBadge({ status }: { status: Medicine["status"] }) {
  const { label, symbol, color } = StatusStyle[status];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: Space.xs,
        paddingVertical: Space.xs,
        paddingLeft: Space.sm,
        paddingRight: 10,
        borderRadius: Radii.pill,
        backgroundColor: Colors.fill,
      }}
    >
      <SymbolView name={symbol as SFSymbol} size={13} tintColor={color} />
      <Text style={{ ...Type.caption, fontWeight: "600", color: Colors.label }}>{label}</Text>
    </View>
  );
}
