import * as Haptics from "expo-haptics";
import { ScrollView, Text } from "react-native";

import { PressableScale } from "@/components/pressable-scale";
import { Colors, Radii, Space, Type } from "@/constants/theme";

type FilterChipsProps = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
};

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -Space.lg }}
      contentContainerStyle={{ paddingHorizontal: Space.lg, gap: Space.sm }}
    >
      {options.map((option) => {
        const active = option === selected;
        return (
          <PressableScale
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (active) return;
              if (process.env.EXPO_OS === "ios") Haptics.selectionAsync();
              onSelect(option);
            }}
            style={{
              minHeight: 36,
              justifyContent: "center",
              paddingHorizontal: 14,
              borderRadius: Radii.pill,
              backgroundColor: active ? Colors.accent : Colors.fill,
            }}
          >
            <Text
              style={{
                ...Type.subhead,
                fontWeight: "600",
                color: active ? Colors.onAccent : Colors.label,
              }}
            >
              {option}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
