import { SymbolView, type SFSymbol } from "expo-symbols";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/pressable-scale";
import { Colors, Radii, Space, Type } from "@/constants/theme";

type EmptyStateProps = {
  symbol: SFSymbol;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ symbol, title, message, action }: EmptyStateProps) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 56, paddingHorizontal: Space.xxl, gap: Space.sm }}>
      <SymbolView name={symbol} size={40} tintColor={Colors.tertiaryLabel} />
      <Text style={{ ...Type.headline, color: Colors.label, marginTop: Space.xs }}>{title}</Text>
      <Text style={{ ...Type.subhead, color: Colors.secondaryLabel, textAlign: "center", lineHeight: 20 }}>
        {message}
      </Text>
      {action && (
        <PressableScale
          accessibilityRole="button"
          onPress={action.onPress}
          style={{
            marginTop: Space.md,
            minHeight: 44,
            justifyContent: "center",
            paddingHorizontal: Space.xl,
            borderRadius: Radii.pill,
            backgroundColor: Colors.primary,
          }}
        >
          <Text style={{ ...Type.subhead, fontWeight: "600", color: Colors.onPrimary }}>{action.label}</Text>
        </PressableScale>
      )}
    </View>
  );
}
