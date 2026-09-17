import { useRouter } from "expo-router";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Medicine } from "@/constants/medicines";
import { Colors, Space, StatusStyle, Type } from "@/constants/theme";

type MedicineRowProps = {
  medicine: Medicine;
  subtitle: string;
  trailing?: string;
  first?: boolean;
};

// Compact grouped-list row for summaries. Rows highlight on press instead of scaling.
export function MedicineRow({ medicine, subtitle, trailing, first }: MedicineRowProps) {
  const router = useRouter();
  const status = StatusStyle[medicine.status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${medicine.name} ${medicine.strength}, ${status.label}`}
      onPress={() => router.push({ pathname: "/medicine/[id]", params: { id: medicine.id } })}
      style={({ pressed }) => ({ backgroundColor: pressed ? Colors.fill : "transparent" })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Space.md,
          marginLeft: Space.lg,
          paddingRight: Space.lg,
          paddingVertical: Space.md,
          borderTopWidth: first ? 0 : StyleSheet.hairlineWidth,
          borderTopColor: Colors.separator,
        }}
      >
        <SymbolView name={status.symbol as SFSymbol} size={20} tintColor={status.color} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ ...Type.body, fontWeight: "500", color: Colors.label }} numberOfLines={1}>
            {medicine.name}{" "}
            <Text style={{ ...Type.subhead, fontWeight: "400", color: Colors.secondaryLabel }}>{medicine.strength}</Text>
          </Text>
          <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        {trailing && (
          <Text style={{ ...Type.footnote, color: Colors.tertiaryLabel, fontVariant: ["tabular-nums"] }}>{trailing}</Text>
        )}
        <SymbolView name="chevron.right" size={12} weight="semibold" tintColor={Colors.tertiaryLabel} />
      </View>
    </Pressable>
  );
}
