import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { Link, Stack } from "expo-router";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { ScrollView, StyleSheet, Text, View, type ColorValue } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { useAccountButton } from "@/components/account-button";
import { Card, cardStyle } from "@/components/card";
import { PressableScale } from "@/components/pressable-scale";
import { MEDICINES, type Medicine } from "@/constants/medicines";
import { Colors, Radii, Space, StatusStyle, Type } from "@/constants/theme";
import { useCompare, type CompareSlot } from "@/store/compare";

function findMedicine(id: string) {
  return MEDICINES.find((m) => m.id === id) ?? MEDICINES[0];
}

function verdict(a: Medicine, b: Medicine): { symbol: SFSymbol; color: ColorValue; title: string; message: string } {
  if (a.id === b.id) {
    return {
      symbol: "equal.circle.fill",
      color: Colors.secondaryLabel,
      title: "Aceeași prezentare",
      message: "Alege un al doilea medicament pentru comparație.",
    };
  }
  if (a.dci === b.dci && a.strength === b.strength && a.form === b.form) {
    return {
      symbol: "checkmark.seal.fill",
      color: StatusStyle.available.color,
      title: "Substituție generică posibilă",
      message: `Ambele conțin ${a.dci} ${a.strength}, în formă echivalentă.`,
    };
  }
  if (a.dci === b.dci) {
    return {
      symbol: "exclamationmark.triangle.fill",
      color: StatusStyle.temporary.color,
      title: "Aceeași DCI, prezentare diferită",
      message: `Substanța activă coincide (${a.dci}), dar forma sau concentrația diferă.`,
    };
  }
  return {
    symbol: "xmark.circle.fill",
    color: StatusStyle.permanent.color,
    title: "Nu sunt interschimbabile",
    message: `${a.dci} și ${b.dci} sunt substanțe active diferite.`,
  };
}

function SlotCard({ slot, medicine }: { slot: CompareSlot; medicine: Medicine }) {
  return (
    <Link href={{ pathname: "/pick-medicine", params: { slot } }} asChild>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Medicament ${slot === "A" ? 1 : 2}: ${medicine.name}. Schimbă`}
        // Link asChild (Slot) rejects style arrays, so merge into one object.
        style={{ ...cardStyle, flexDirection: "row", alignItems: "center" }}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }}>
            Medicament {slot === "A" ? 1 : 2}
          </Text>
          <Text style={{ ...Type.headline, color: Colors.label }} numberOfLines={1}>
            {medicine.name}{" "}
            <Text style={{ ...Type.subhead, color: Colors.secondaryLabel }}>{medicine.strength}</Text>
          </Text>
          <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }} numberOfLines={1}>
            {medicine.dci} · {medicine.form}
          </Text>
        </View>
        <SymbolView name="chevron.up.chevron.down" size={15} tintColor={Colors.tertiaryLabel} />
      </PressableScale>
    </Link>
  );
}

export default function CompareScreen() {
  const a = findMedicine(useCompare((state) => state.A));
  const b = findMedicine(useCompare((state) => state.B));
  const swap = useCompare((state) => state.swap);
  const account = useAccountButton();
  const result = verdict(a, b);

  const rows = [
    { label: "Substanță activă", a: a.dci, b: b.dci },
    { label: "Concentrație", a: a.strength, b: b.strength },
    { label: "Formă farmaceutică", a: a.form, b: b.form },
    { label: "Cod ATC", a: a.atc, b: b.atc },
    { label: "Regim de eliberare", a: a.prescriptionType, b: b.prescriptionType },
  ];

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button {...account} />
      </Stack.Toolbar>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: Space.lg, gap: Space.lg }}
      >
        <View style={{ gap: Space.sm }}>
          <SlotCard slot="A" medicine={a} />
          <SlotCard slot="B" medicine={b} />

          {/* Floating control over content: the one place glass belongs on this screen. */}
          <View
            pointerEvents="box-none"
            style={{ ...StyleSheet.absoluteFill, alignItems: "flex-end", justifyContent: "center", paddingRight: 52 }}
          >
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Inversează medicamentele"
              onPress={() => {
                if (process.env.EXPO_OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                swap();
              }}
            >
              <GlassView
                isInteractive
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: Radii.pill,
                  alignItems: "center",
                  justifyContent: "center",
                  ...(!isLiquidGlassAvailable() && {
                    backgroundColor: Colors.surface,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                  }),
                }}
              >
                <SymbolView name="arrow.up.arrow.down" size={17} weight="semibold" tintColor={Colors.accent} />
              </GlassView>
            </PressableScale>
          </View>
        </View>

        <Animated.View key={result.title} entering={FadeIn.duration(180)}>
          <Card style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <SymbolView name={result.symbol} size={26} tintColor={result.color} />
            <View style={{ flex: 1, gap: Space.xs }}>
              <Text style={{ ...Type.headline, color: Colors.label }}>{result.title}</Text>
              <Text style={{ ...Type.subhead, color: Colors.secondaryLabel, lineHeight: 20 }}>{result.message}</Text>
            </View>
          </Card>
        </Animated.View>

        <Card style={{ gap: 0, paddingVertical: Space.xs }}>
          {rows.map((row, index) => {
            const match = row.a === row.b;
            return (
              <View
                key={row.label}
                style={{
                  paddingVertical: Space.md,
                  gap: Space.xs,
                  borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
                  borderTopColor: Colors.separator,
                }}
              >
                <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }}>{row.label}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: Space.sm }}>
                  <Text selectable style={{ ...Type.subhead, fontWeight: "500", color: Colors.label, flex: 1 }}>
                    {row.a}
                  </Text>
                  <SymbolView
                    name={match ? "equal" : "notequal"}
                    size={13}
                    weight="semibold"
                    tintColor={match ? StatusStyle.available.color : Colors.tertiaryLabel}
                  />
                  <Text
                    selectable
                    style={{ ...Type.subhead, fontWeight: "500", color: Colors.label, flex: 1, textAlign: "right" }}
                  >
                    {row.b}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        <Text style={{ ...Type.footnote, color: Colors.tertiaryLabel, paddingHorizontal: Space.lg }}>
          Evaluare orientativă. Verifică RCP-ul înainte de orice substituție.
        </Text>
      </ScrollView>
    </>
  );
}
