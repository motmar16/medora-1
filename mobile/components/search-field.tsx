import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { Text, TextInput, View } from "react-native";

import { PressableScale } from "@/components/pressable-scale";
import { Colors, Radii, Space, Type } from "@/constants/theme";

// Pill search field with the ink "Caută" button, shared by Welcome and Azi.
// Uncontrolled: the text is only read when the search is submitted.
export function SearchField({ onSearch }: { onSearch: (query: string) => void }) {
  const query = useRef("");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Space.sm,
        minHeight: 58,
        paddingLeft: Space.lg,
        paddingRight: 6,
        paddingVertical: 6,
        borderRadius: Radii.pill,
        backgroundColor: Colors.surface,
        boxShadow: "0 6px 20px rgba(24, 24, 23, 0.10)",
      }}
    >
      <SymbolView name="magnifyingglass" size={18} tintColor={Colors.secondaryLabel} />
      <TextInput
        placeholder="Medicament, DCI, ATC"
        maxFontSizeMultiplier={1.3}
        placeholderTextColor={Colors.tertiaryLabel}
        onChangeText={(text) => (query.current = text)}
        onSubmitEditing={() => onSearch(query.current)}
        returnKeyType="search"
        autoCorrect={false}
        style={{ ...Type.callout, flex: 1, minHeight: 44, color: Colors.label }}
      />
      <PressableScale
        accessibilityRole="button"
        onPress={() => onSearch(query.current)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          minHeight: 46,
          paddingHorizontal: Space.lg,
          borderRadius: Radii.pill,
          backgroundColor: Colors.primary,
        }}
      >
        <Text maxFontSizeMultiplier={1.3} style={{ ...Type.subhead, fontWeight: "600", color: Colors.onPrimary }}>
          Caută
        </Text>
        <SymbolView name="arrow.right" size={13} weight="semibold" tintColor={Colors.onPrimary} />
      </PressableScale>
    </View>
  );
}
