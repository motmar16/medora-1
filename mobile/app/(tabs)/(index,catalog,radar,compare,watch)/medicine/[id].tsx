import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { RiveBookmarkButton } from "@/components/rive-bookmark";
import { StatusBadge } from "@/components/status-badge";
import { MEDICINES } from "@/constants/medicines";
import { Colors, Space, StatusStyle, Type } from "@/constants/theme";
import { useWatchlist } from "@/store/watchlist";

function Section({ symbol, title, body }: { symbol: SFSymbol; title: string; body: string }) {
  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "center", gap: Space.sm }}>
        <SymbolView name={symbol} size={17} tintColor={Colors.secondaryLabel} />
        <Text style={{ ...Type.headline, color: Colors.label }}>{title}</Text>
      </View>
      <Text selectable style={{ ...Type.subhead, color: Colors.label, lineHeight: 22 }}>
        {body}
      </Text>
    </Card>
  );
}

export default function MedicineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const medicine = MEDICINES.find((m) => m.id === id);
  const saved = useWatchlist((state) => state.ids.includes(id));
  const toggle = useWatchlist((state) => state.toggle);

  if (!medicine) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Stack.Screen options={{ title: "Indisponibil" }} />
        <EmptyState
          symbol="pills"
          title="Medicament negăsit"
          message="Produsul nu mai există în nomenclator sau linkul este greșit."
        />
      </ScrollView>
    );
  }

  const facts = [
    { label: "Substanță activă", value: medicine.dci },
    { label: "Cod ATC", value: medicine.atc },
    { label: "Regim de eliberare", value: medicine.prescriptionType },
    { label: "Deținător APP", value: medicine.manufacturer },
  ];

  return (
    <>
      <Stack.Screen options={{ title: medicine.name }} />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={saved ? "bookmark.fill" : "bookmark"}
          accessibilityLabel={saved ? "Nu mai urmări" : "Urmărește"}
          tintColor={Colors.accent}
          onPress={() => {
            if (process.env.EXPO_OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggle(medicine.id);
          }}
        />
      </Stack.Toolbar>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: Space.lg, paddingBottom: Space.xxl * 2, gap: Space.lg }}
      >
        <View style={{ gap: Space.sm }}>
          <Text selectable style={{ ...Type.title3, fontWeight: "400", color: Colors.secondaryLabel }}>
            {medicine.strength} · {medicine.form}
          </Text>
          {/* The alert card below already names the status. */}
          {!medicine.event && <StatusBadge status={medicine.status} />}
        </View>

        <Card
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: Space.md,
            paddingHorizontal: Space.lg,
          }}
        >
          <View style={{ gap: 2, flex: 1, paddingRight: Space.md }}>
            <Text style={{ ...Type.headline, color: Colors.label }}>
              {saved ? "Urmărit în Lista mea" : "Adaugă în Lista mea"}
            </Text>
            <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }}>
              {saved
                ? "Primești notificări când apar alerte ANMDMR"
                : "Apasă steluța pentru a urmări alertele live"}
            </Text>
          </View>
          <RiveBookmarkButton
            saved={saved}
            size={40}
            onToggle={() => {
              if (process.env.EXPO_OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggle(medicine.id);
            }}
          />
        </Card>

        {medicine.event && (
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", gap: Space.sm }}>
              <SymbolView
                name={StatusStyle[medicine.status].symbol as SFSymbol}
                size={17}
                tintColor={StatusStyle[medicine.status].color}
              />
              <Text style={{ ...Type.headline, color: Colors.label }}>{medicine.event}</Text>
            </View>
            {medicine.note && (
              <Text selectable style={{ ...Type.subhead, color: Colors.label, lineHeight: 22 }}>
                {medicine.note}
              </Text>
            )}
            <Text style={{ ...Type.footnote, color: Colors.tertiaryLabel, fontVariant: ["tabular-nums"] }}>
              Notificare ANMDMR · {medicine.date}
            </Text>
          </Card>
        )}

        <Card style={{ gap: 0, paddingVertical: Space.xs }}>
          {facts.map((fact, index) => (
            <View
              key={fact.label}
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: Space.lg,
                paddingVertical: Space.md,
                borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
                borderTopColor: Colors.separator,
              }}
            >
              <Text style={{ ...Type.subhead, color: Colors.secondaryLabel }}>{fact.label}</Text>
              <Text
                selectable
                style={{ ...Type.subhead, color: Colors.label, flexShrink: 1, textAlign: "right" }}
              >
                {fact.value}
              </Text>
            </View>
          ))}
        </Card>

        <Section symbol="stethoscope" title="Indicații terapeutice" body={medicine.indications} />
        <Section symbol="hand.raised" title="Contraindicații" body={medicine.contraindications} />

        <Text style={{ ...Type.footnote, color: Colors.tertiaryLabel, paddingHorizontal: Space.lg }}>
          Informații demonstrative. Consultă RCP-ul aprobat înainte de prescriere sau eliberare.
        </Text>
      </ScrollView>
    </>
  );
}
