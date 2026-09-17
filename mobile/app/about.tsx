import Constants from "expo-constants";
import { SymbolView, type SFSymbol } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/card";
import { PressableScale } from "@/components/pressable-scale";
import { Colors, Radii, Space, Type } from "@/constants/theme";

const POINTS: { symbol: SFSymbol; title: string; body: string }[] = [
  {
    symbol: "doc.text.magnifyingglass",
    title: "Sursa datelor",
    body: "Nomenclatorul și notificările de discontinuitate publicate de ANMDMR.",
  },
  {
    symbol: "flask",
    title: "Date demonstrative",
    body: "Denumirile comerciale din această versiune sunt fictive.",
  },
  {
    symbol: "stethoscope",
    title: "Nu înlocuiește RCP-ul",
    body: "Verifică întotdeauna rezumatul caracteristicilor produsului și judecata clinică.",
  },
];

export default function AboutSheet() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: Space.xxl, gap: Space.xl }}
    >
      <View style={{ alignItems: "center", gap: Space.sm }}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={{ width: 64, height: 64 }}
          accessibilityIgnoresInvertColors
        />
        <Text style={{ ...Type.title3, color: Colors.label }}>Medora</Text>
        <Text style={{ ...Type.footnote, color: Colors.secondaryLabel, fontVariant: ["tabular-nums"] }}>
          Versiunea {Constants.expoConfig?.version}
        </Text>
      </View>

      <Card style={{ gap: 0, paddingVertical: Space.xs }}>
        {POINTS.map((point, index) => (
          <View
            key={point.title}
            style={{
              flexDirection: "row",
              gap: Space.md,
              paddingVertical: Space.md,
              borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
              borderTopColor: Colors.separator,
            }}
          >
            <SymbolView name={point.symbol} size={20} tintColor={Colors.accent} style={{ marginTop: 1 }} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ ...Type.headline, color: Colors.label }}>{point.title}</Text>
              <Text style={{ ...Type.subhead, color: Colors.secondaryLabel, lineHeight: 20 }}>{point.body}</Text>
            </View>
          </View>
        ))}
      </Card>

      <PressableScale
        accessibilityRole="link"
        onPress={() => WebBrowser.openBrowserAsync("https://www.anm.ro")}
        style={{
          minHeight: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: Space.sm,
          borderRadius: Radii.pill,
          backgroundColor: Colors.accent,
        }}
      >
        <Text style={{ ...Type.headline, color: Colors.onAccent }}>Deschide site-ul ANMDMR</Text>
        <SymbolView name="arrow.up.right" size={14} weight="semibold" tintColor={Colors.onAccent} />
      </PressableScale>
    </ScrollView>
  );
}
