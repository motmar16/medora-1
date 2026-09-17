import { BoringAvatar, MEDORA_PALETTES } from "@/components/boring-avatar";
import { PressableScale } from "@/components/pressable-scale";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { BrandMark } from "@/components/brand-mark";
import { Card } from "@/components/card";
import { Brand, Colors, Radii, Space, Type } from "@/constants/theme";
import { useAlertPrefs } from "@/store/alert-prefs";
import { useSession } from "@/store/session";
import { useWatchlist } from "@/store/watchlist";

const PROVIDER_LABEL = { apple: "Apple", google: "Google", email: "cod pe email" } as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => /\p{L}/u.test(part[0] ?? ""))
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function AccountSheet() {
  const router = useRouter();
  const user = useSession((state) => state.user);
  const signOut = useSession((state) => state.signOut);
  const leaving = useRef(false);
  const [paletteIndex, setPaletteIndex] = useState<number | null>(null);

  // Signing out flips the Welcome guard in the root stack; do it once this sheet has dismissed.
  useEffect(
    () => () => {
      if (leaving.current) signOut();
    },
    [signOut]
  );

  const leaveToWelcome = () => {
    if (process.env.EXPO_OS === "ios") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    leaving.current = true;
    router.back();
  };
  const watchedCount = useWatchlist((state) => state.ids.length);
  const alertsEnabled = useAlertPrefs((state) => Object.values(state.events).some(Boolean));

  if (!user) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: Space.xxl, paddingTop: Space.xxl + Space.sm, gap: Space.lg, alignItems: "center" }}
      >
        <BoringAvatar name="Medora Guest" size={68} />
        <Text style={{ ...Type.title3, color: Colors.label }}>Nu ești conectat</Text>
        <Text style={{ ...Type.subhead, lineHeight: 20, color: Colors.secondaryLabel, textAlign: "center" }}>
          Conectează-te ca să păstrezi Lista mea pe toate dispozitivele și să primești alertele ANMDMR.
        </Text>
        <View style={{ alignSelf: "stretch", gap: Space.sm, marginTop: Space.sm }}>
          <ActionButton
            label="Conectează-te"
            onPress={() => router.replace({ pathname: "/sign-in", params: { mode: "signin" } })}
          />
          <ActionButton
            label="Creează cont gratuit"
            variant="secondary"
            onPress={() => router.replace({ pathname: "/sign-in", params: { mode: "signup" } })}
          />
          <ActionButton label="Înapoi la ecranul de start" variant="plain" onPress={leaveToWelcome} />
        </View>
      </ScrollView>
    );
  }

  const rows = [
    { symbol: "person.badge.key", label: "Autentificare", value: PROVIDER_LABEL[user.provider] },
    { symbol: "bookmark", label: "Produse urmărite", value: String(watchedCount) },
  ] as const;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: Space.xxl, paddingTop: Space.xxl + Space.sm, gap: Space.xl }}
    >
      <View style={{ alignItems: "center", gap: Space.sm }}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Avatar utilizator"
          accessibilityHint="Apasă pentru a schimba paleta de culori Medora"
          onPress={() => {
            if (process.env.EXPO_OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setPaletteIndex((prev) => (prev === null ? 1 : (prev + 1) % MEDORA_PALETTES.length));
          }}
        >
          <BoringAvatar
            name={user.name}
            email={user.email}
            size={84}
            colors={paletteIndex !== null ? MEDORA_PALETTES[paletteIndex] : undefined}
          />
        </PressableScale>
        <Text selectable style={{ ...Type.title3, color: Colors.label }}>
          {user.name}
        </Text>
        <Text selectable style={{ ...Type.subhead, color: Colors.secondaryLabel }}>
          {user.email}
        </Text>
      </View>

      <Card style={{ gap: 0, paddingVertical: Space.xs }}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Space.md,
              paddingVertical: Space.md,
              borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
              borderTopColor: Colors.separator,
            }}
          >
            <SymbolView name={row.symbol} size={18} tintColor={Colors.accent} />
            <Text style={{ ...Type.body, color: Colors.label, flex: 1 }}>{row.label}</Text>
            <Text style={{ ...Type.body, color: Colors.secondaryLabel, fontVariant: ["tabular-nums"] }}>{row.value}</Text>
          </View>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/alert-preferences")}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: Space.md,
            paddingVertical: Space.md,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: Colors.separator,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <SymbolView name={alertsEnabled ? "bell.badge" : "bell.slash"} size={18} tintColor={Colors.accent} />
          <Text style={{ ...Type.body, color: Colors.label, flex: 1 }}>Preferințe alerte</Text>
          <Text style={{ ...Type.body, color: Colors.secondaryLabel }}>{alertsEnabled ? "Active" : "Oprite"}</Text>
          <SymbolView name="chevron.right" size={12} weight="semibold" tintColor={Colors.tertiaryLabel} />
        </Pressable>
      </Card>

      <ActionButton
        label="Deconectează-te"
        variant="secondary"
        onPress={() =>
          Alert.alert("Te deconectezi?", "Revii la ecranul de start. Lista mea rămâne salvată pe acest iPhone.", [
            { text: "Anulează", style: "cancel" },
            {
              text: "Deconectează-te",
              style: "destructive",
              onPress: leaveToWelcome,
            },
          ])
        }
      />
    </ScrollView>
  );
}
