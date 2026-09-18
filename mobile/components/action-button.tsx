import { SymbolView, type SFSymbol } from "expo-symbols";
import { Text } from "react-native";

import { PressableScale } from "@/components/pressable-scale";
import { Colors, Radii, Space, Type } from "@/constants/theme";

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "plain";
  symbol?: SFSymbol;
  disabled?: boolean;
};

// Full-width pill actions. Primary is the ink button from the web landing.
export function ActionButton({ label, onPress, variant = "primary", symbol, disabled }: ActionButtonProps) {
  const foreground =
    variant === "primary" ? Colors.onPrimary : variant === "secondary" ? Colors.label : Colors.secondaryLabel;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: variant === "plain" ? 44 : 54,
        paddingVertical: Space.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Space.sm,
        paddingHorizontal: Space.xl,
        borderRadius: Radii.pill,
        backgroundColor:
          variant === "primary" ? Colors.primary : variant === "secondary" ? Colors.fill : "transparent",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {symbol && <SymbolView name={symbol} size={17} weight="semibold" tintColor={foreground} />}
      <Text
        maxFontSizeMultiplier={1.4}
        numberOfLines={2}
        style={{
          ...Type.headline,
          textAlign: "center",
          fontWeight: variant === "plain" ? "500" : "600",
          color: foreground,
        }}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
