import { Stack, useRouter, type Href } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { Image, ScrollView, Text, View, type ImageSourcePropType } from "react-native";

import { AccountAvatarButton } from "@/components/account-button";
import { ActionButton } from "@/components/action-button";
import { Card, cardStyle } from "@/components/card";
import { MedicineRow } from "@/components/medicine-row";
import { PressableScale } from "@/components/pressable-scale";
import { SearchField } from "@/components/search-field";
import { SectionHeader } from "@/components/section-header";
import { MEDICINES } from "@/constants/medicines";
import { catalogHref } from "@/constants/modules";
import { Colors, Radii, Space, StatusStyle, Type } from "@/constants/theme";
import { useAlertPrefs } from "@/store/alert-prefs";
import { useWatchlist } from "@/store/watchlist";
import { countPhrase, formatToday } from "@/utils/format";

const RADAR_HREF = "/(tabs)/(radar)/radar";
const WATCH_HREF = "/(tabs)/(watch)/watch";
const PREVIEW_ROWS = 3;

function Stat({
  icon,
  value,
  label,
  onPress,
}: {
  icon: ImageSourcePropType;
  value: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
      onPress={onPress}
      style={{ ...cardStyle, flex: 1, gap: 2, padding: Space.md }}
    >
      <Image source={icon} style={{ width: 44, height: 44 }} accessibilityIgnoresInvertColors />
      <Text style={{ ...Type.title1, color: Colors.label, fontVariant: ["tabular-nums"] }}>{value}</Text>
      <Text style={{ ...Type.footnote, lineHeight: 17, color: Colors.secondaryLabel }} numberOfLines={2}>
        {label}
      </Text>
    </PressableScale>
  );
}

// "Privire de ansamblu" from the web app: today's radar, stats and the watched list at a glance.
export default function TodayScreen() {
  const router = useRouter();
  const watchedIds = useWatchlist((state) => state.ids);
  const alertsEnabled = useAlertPrefs((state) => Object.values(state.events).some(Boolean));

  const alerts = useMemo(() => MEDICINES.filter((m) => m.event), []);
  const watched = useMemo(() => MEDICINES.filter((m) => watchedIds.includes(m.id)), [watchedIds]);
  const interruptions = alerts.filter((m) => m.status === "temporary" || m.status === "permanent").length;
  const resumed = alerts.filter((m) => m.status === "resumed").length;

  const go = (href: string) => router.navigate(href as Href);

  const radarTitle =
    alerts.length === 0
      ? "Nicio schimbare de verificat"
      : alerts.length === 1
        ? "O schimbare necesită verificare"
        : `${alerts.length} schimbări necesită verificare`;

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={alertsEnabled ? "bell" : "bell.slash"}
          accessibilityLabel="Preferințe alerte"
          onPress={() => router.push("/alert-preferences")}
        />
        <Stack.Toolbar.View>
          <AccountAvatarButton />
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: Space.lg, paddingBottom: Space.xxl * 2, gap: Space.xl }}
      >
        <View style={{ gap: Space.xs, paddingHorizontal: Space.xs, marginTop: -Space.sm }}>
          <Text style={{ ...Type.subhead, color: Colors.secondaryLabel }}>{formatToday()}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 7, height: 7, borderRadius: Radii.pill, backgroundColor: StatusStyle.available.color }} />
            <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }}>
              Surse monitorizate: ANMDMR · EMA · CNAS
            </Text>
          </View>
        </View>

        <SearchField onSearch={(query) => go(catalogHref(query))} />

        <Card style={{ flexDirection: "row", alignItems: "center", gap: Space.md }}>
          <View style={{ flex: 1, gap: Space.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <SymbolView name="dot.radiowaves.left.and.right" size={14} tintColor={Colors.accent} />
              <Text style={{ ...Type.caption, fontWeight: "600", letterSpacing: 0.6, color: Colors.accent }}>
                RADAR DISPONIBILITATE
              </Text>
            </View>
            <Text style={{ ...Type.title3, fontWeight: "700", color: Colors.label }}>{radarTitle}</Text>
            {alerts.length > 0 && (
              <Text style={{ ...Type.subhead, lineHeight: 20, color: Colors.secondaryLabel }}>
                {countPhrase(interruptions, "O întrerupere", "întreruperi", "Nicio întrerupere")} și{" "}
                {countPhrase(resumed, "o revenire", "reveniri", "nicio revenire")} în scenariile urmărite.
              </Text>
            )}
            <PressableScale
              accessibilityRole="button"
              onPress={() => go(RADAR_HREF)}
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                minHeight: 40,
                marginTop: Space.xs,
                paddingHorizontal: Space.lg,
                borderRadius: Radii.pill,
                backgroundColor: Colors.primary,
              }}
            >
              <Text style={{ ...Type.subhead, fontWeight: "600", color: Colors.onPrimary }}>Deschide jurnalul</Text>
              <SymbolView name="arrow.right" size={12} weight="semibold" tintColor={Colors.onPrimary} />
            </PressableScale>
          </View>
          <Image
            source={require("@/assets/images/modules/radar.png")}
            style={{ width: 76, height: 76 }}
            accessibilityIgnoresInvertColors
          />
        </Card>

        <View style={{ flexDirection: "row", gap: Space.sm }}>
          <Stat
            icon={require("@/assets/images/modules/watchlist.png")}
            value={watched.length}
            label="Sub observație"
            onPress={() => go(WATCH_HREF)}
          />
          <Stat
            icon={require("@/assets/images/modules/compare.png")}
            value={interruptions}
            label={interruptions === 1 ? "Întrerupere activă" : "Întreruperi active"}
            onPress={() => go(RADAR_HREF)}
          />
          <Stat
            icon={require("@/assets/images/modules/medicine.png")}
            value={resumed}
            label={resumed === 1 ? "Revenire anunțată" : "Reveniri anunțate"}
            onPress={() => go(RADAR_HREF)}
          />
        </View>

        <View style={{ gap: Space.sm }}>
          <SectionHeader title="În radarul tău" action={{ label: "Toate", onPress: () => go(RADAR_HREF) }} />
          <Card style={{ gap: 0, padding: 0, overflow: "hidden" }}>
            {alerts.slice(0, PREVIEW_ROWS).map((medicine, index) => (
              <MedicineRow
                key={medicine.id}
                medicine={medicine}
                first={index === 0}
                subtitle={StatusStyle[medicine.status].label}
                trailing={medicine.date?.replace(" 2026", "")}
              />
            ))}
          </Card>
        </View>

        <View style={{ gap: Space.sm }}>
          <SectionHeader
            title="Medicamente urmărite"
            action={watched.length > 0 ? { label: "Lista mea", onPress: () => go(WATCH_HREF) } : undefined}
          />
          {watched.length > 0 ? (
            <Card style={{ gap: 0, padding: 0, overflow: "hidden" }}>
              {watched.slice(0, PREVIEW_ROWS).map((medicine, index) => (
                <MedicineRow
                  key={medicine.id}
                  medicine={medicine}
                  first={index === 0}
                  subtitle={`${medicine.dci} · ${StatusStyle[medicine.status].label}`}
                />
              ))}
            </Card>
          ) : (
            <Card style={{ alignItems: "center", paddingVertical: Space.xl }}>
              <Text style={{ ...Type.subhead, color: Colors.secondaryLabel, textAlign: "center" }}>
                Urmărește primul medicament ca să-i vezi aici statusul.
              </Text>
              <ActionButton label="Deschide catalogul" variant="secondary" onPress={() => go(catalogHref(""))} />
            </Card>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: Space.sm, paddingHorizontal: Space.xs }}>
          <SymbolView name="checkmark.shield" size={16} tintColor={Colors.tertiaryLabel} />
          <Text style={{ ...Type.footnote, lineHeight: 18, color: Colors.tertiaryLabel, flex: 1 }}>
            Fiecare schimbare are o sursă oficială. În versiunea finală vei vedea documentul original, data și
            istoricul; acum sunt scenarii demonstrative.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
