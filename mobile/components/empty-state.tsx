import { SymbolView, type SFSymbol } from "expo-symbols";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/pressable-scale";
import { RiveEmptyState } from "@/components/rive-empty-state";
import { Colors, Radii, Space, Type } from "@/constants/theme";

type EmptyStateProps = {
  symbol?: SFSymbol;
  riveType?: "search" | "watchlist" | "check";
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ symbol, riveType, title, message, action }: EmptyStateProps) {
  const resolvedRiveType =
    riveType ??
    (symbol === "magnifyingglass"
      ? "search"
      : symbol === "bookmark"
      ? "watchlist"
      : symbol === "checkmark.shield" || symbol === "checkmark.circle"
      ? "check"
      : undefined);

  const actionButton = action ? (
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
  ) : undefined;

  if (resolvedRiveType) {
    return (
      <RiveEmptyState
        type={resolvedRiveType}
        title={title}
        message={message}
        action={actionButton}
      />
    );
  }

  return (
    <View style={{ alignItems: "center", paddingVertical: 56, paddingHorizontal: Space.xxl, gap: Space.sm }}>
      {symbol && <SymbolView name={symbol} size={40} tintColor={Colors.tertiaryLabel} />}
      <Text style={{ ...Type.headline, color: Colors.label, marginTop: Space.xs }}>{title}</Text>
      <Text style={{ ...Type.subhead, color: Colors.secondaryLabel, textAlign: "center", lineHeight: 20 }}>
        {message}
      </Text>
      {actionButton}
    </View>
  );
}
