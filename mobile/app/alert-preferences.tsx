import * as Haptics from "expo-haptics";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { BrandMark } from "@/components/brand-mark";
import { Card } from "@/components/card";
import { MEDICINES } from "@/constants/medicines";
import { Colors, Space, StatusStyle, Type } from "@/constants/theme";
import { useAlertPrefs, type AlertEventType, type AlertFrequency } from "@/store/alert-prefs";
import { useWatchlist } from "@/store/watchlist";
import { countPhrase } from "@/utils/format";

const EVENT_TYPES: { type: AlertEventType; label: string }[] = [
  { type: "temporary", label: "Rupturi temporare" },
  { type: "permanent", label: "Retrageri definitive" },
  { type: "resumed", label: "Reluări de comercializare" },
];

const FREQUENCIES: { value: AlertFrequency; label: string; detail: string }[] = [
  { value: "instant", label: "La fiecare schimbare", detail: "Imediat ce ANMDMR publică" },
  { value: "daily", label: "Rezumat zilnic", detail: "O notificare pe zi, dimineața" },
  { value: "weekly", label: "Rezumat săptămânal", detail: "Luni dimineața" },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={{ ...Type.footnote, color: Colors.secondaryLabel, paddingHorizontal: Space.lg, marginBottom: -Space.xs }}>
      {children}
    </Text>
  );
}

// Settings convention: every change applies immediately, no save button.
export default function AlertPreferencesSheet() {
  const events = useAlertPrefs((state) => state.events);
  const frequency = useAlertPrefs((state) => state.frequency);
  const setEvent = useAlertPrefs((state) => state.setEvent);
  const setFrequency = useAlertPrefs((state) => state.setFrequency);
  const watchedIds = useWatchlist((state) => state.ids);

  const matching = MEDICINES.filter(
    (m) => watchedIds.includes(m.id) && m.event && m.status in events && events[m.status as AlertEventType]
  ).length;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: Space.lg, paddingTop: Space.xxl, gap: Space.lg }}
    >
      <View style={{ alignItems: "center", gap: Space.sm, paddingBottom: Space.xs }}>
        <BrandMark size={44} />
        <Text accessibilityRole="header" style={{ ...Type.title3, color: Colors.label }}>
          Preferințe alerte
        </Text>
        <Text style={{ ...Type.subhead, lineHeight: 20, color: Colors.secondaryLabel, textAlign: "center" }}>
          Alege ce schimbări ANMDMR vrei să primești pentru medicamentele din Lista mea.
        </Text>
      </View>

      <SectionLabel>Tipuri de evenimente</SectionLabel>
      <Card style={{ gap: 0, paddingVertical: 0 }}>
        {EVENT_TYPES.map(({ type, label }, index) => (
          <View
            key={type}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Space.md,
              minHeight: 52,
              borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
              borderTopColor: Colors.separator,
            }}
          >
            <SymbolView name={StatusStyle[type].symbol as SFSymbol} size={20} tintColor={StatusStyle[type].color} />
            <Text style={{ ...Type.body, color: Colors.label, flex: 1 }}>{label}</Text>
            <Switch
              accessibilityLabel={label}
              value={events[type]}
              onValueChange={(enabled) => setEvent(type, enabled)}
              // RN's Switch defaults to alignSelf: flex-start, which pins it to the top of the row.
              style={{ alignSelf: "center" }}
            />
          </View>
        ))}
      </Card>

      <SectionLabel>Frecvență</SectionLabel>
      <Card style={{ gap: 0, padding: 0, overflow: "hidden" }}>
        {FREQUENCIES.map((option, index) => {
          const selected = option.value === frequency;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                if (selected) return;
                if (process.env.EXPO_OS === "ios") Haptics.selectionAsync();
                setFrequency(option.value);
              }}
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
                  <Text style={{ ...Type.body, color: Colors.label }}>{option.label}</Text>
                  <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }}>{option.detail}</Text>
                </View>
                {selected && <SymbolView name="checkmark" size={17} weight="semibold" tintColor={Colors.accent} />}
              </View>
            </Pressable>
          );
        })}
      </Card>

      <Text style={{ ...Type.footnote, lineHeight: 18, color: Colors.secondaryLabel, paddingHorizontal: Space.lg }}>
        {countPhrase(matching, "O alertă", "alerte", "Nicio alertă")} din Lista mea{" "}
        {matching === 1 ? "corespunde" : "corespund"} acestor preferințe. Notificările push vor funcționa odată cu
        contul Medora; acum preferințele se salvează doar pe acest iPhone.
      </Text>
    </ScrollView>
  );
}
