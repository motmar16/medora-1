import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

import { Colors, Space, Type } from "@/constants/theme";

type SectionHeaderProps = {
  title: string;
  action?: { label: string; onPress: () => void };
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Space.xs }}>
      <Text accessibilityRole="header" style={{ ...Type.title3, color: Colors.label }}>
        {title}
      </Text>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={action.onPress}
          hitSlop={8}
          style={({ pressed }) => ({
            minHeight: 44,
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
            opacity: pressed ? 0.4 : 1,
          })}
        >
          <Text style={{ ...Type.subhead, fontWeight: "500", color: Colors.accent }}>{action.label}</Text>
          <SymbolView name="chevron.right" size={12} weight="semibold" tintColor={Colors.accent} />
        </Pressable>
      )}
    </View>
  );
}
