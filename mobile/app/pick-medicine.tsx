import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/card";
import { MEDICINES } from "@/constants/medicines";
import { Colors, Space, Type } from "@/constants/theme";
import { useCompare, type CompareSlot } from "@/store/compare";

export default function PickMedicineSheet() {
  const router = useRouter();
  const { slot = "A" } = useLocalSearchParams<{ slot: CompareSlot }>();
  const selectedId = useCompare((state) => state[slot]);
  const pick = useCompare((state) => state.pick);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: Space.lg, paddingTop: Space.xxl, gap: Space.lg }}
    >
      <Text style={{ ...Type.headline, color: Colors.label, textAlign: "center" }}>
        Medicament {slot === "A" ? 1 : 2}
      </Text>

      <Card style={{ gap: 0, padding: 0, overflow: "hidden" }}>
        {MEDICINES.map((medicine, index) => {
          const selected = medicine.id === selectedId;
          return (
            <Pressable
              key={medicine.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                if (process.env.EXPO_OS === "ios") Haptics.selectionAsync();
                pick(slot, medicine.id);
                router.back();
              }}
              // List rows highlight on press instead of scaling.
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
                  borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
                  borderTopColor: Colors.separator,
                }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ ...Type.body, color: Colors.label }} numberOfLines={1}>
                    {medicine.name}{" "}
                    <Text style={{ ...Type.subhead, color: Colors.secondaryLabel }}>{medicine.strength}</Text>
                  </Text>
                  <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }} numberOfLines={1}>
                    {medicine.dci} · {medicine.form}
                  </Text>
                </View>
                {selected && <SymbolView name="checkmark" size={17} weight="semibold" tintColor={Colors.accent} />}
              </View>
            </Pressable>
          );
        })}
      </Card>
    </ScrollView>
  );
}
