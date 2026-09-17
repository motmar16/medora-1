import { FlashList } from "@shopify/flash-list";
import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { MedicineCard } from "@/components/medicine-card";
import { MEDICINES } from "@/constants/medicines";
import { Colors, Space, Type } from "@/constants/theme";
import { useSession } from "@/store/session";
import { useWatchlist } from "@/store/watchlist";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card style={{ flex: 1, gap: 2 }}>
      <Text style={{ ...Type.title1, color: Colors.label, fontVariant: ["tabular-nums"] }}>{value}</Text>
      <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }}>{label}</Text>
    </Card>
  );
}

function SyncPrompt({ onSignIn }: { onSignIn: () => void }) {
  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: Space.md }}>
        <SymbolView name="icloud" size={22} tintColor={Colors.accent} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ ...Type.headline, color: Colors.label }}>Păstrează lista în cont</Text>
          <Text style={{ ...Type.subhead, lineHeight: 20, color: Colors.secondaryLabel }}>
            Sincronizare pe toate dispozitivele și notificări când ANMDMR schimbă statusul.
          </Text>
        </View>
      </View>
      <ActionButton label="Conectează-te" onPress={onSignIn} />
    </Card>
  );
}

export default function WatchScreen() {
  const router = useRouter();
  const signedIn = useSession((state) => state.user !== null);
  const ids = useWatchlist((state) => state.ids);
  const watched = useMemo(() => MEDICINES.filter((m) => ids.includes(m.id)), [ids]);
  const activeAlerts = watched.filter((m) => m.status === "temporary" || m.status === "permanent").length;

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={signedIn ? "person.crop.circle.fill" : "person.crop.circle"}
          accessibilityLabel="Cont"
          onPress={() => router.push("/account")}
        />
      </Stack.Toolbar>

      <FlashList
        data={watched}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MedicineCard medicine={item} />}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: Space.lg }}
        ItemSeparatorComponent={() => <View style={{ height: Space.md }} />}
        ListHeaderComponent={
          <View style={{ gap: Space.xl, paddingBottom: watched.length > 0 ? Space.md : 0 }}>
            {!signedIn && (
              <SyncPrompt onSignIn={() => router.push({ pathname: "/sign-in", params: { mode: "signin" } })} />
            )}
            {watched.length > 0 && (
              <>
                <View style={{ flexDirection: "row", gap: Space.md }}>
                  <Stat value={watched.length} label="Urmărite" />
                  <Stat value={activeAlerts} label="Alerte active" />
                </View>
                <Text style={{ ...Type.footnote, color: Colors.secondaryLabel, paddingHorizontal: Space.lg }}>
                  Primești aici modificările de disponibilitate publicate de ANMDMR pentru produsele urmărite.
                </Text>
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            symbol="bookmark"
            title="Nu urmărești niciun produs"
            message="Apasă pe semnul de bookmark din catalog ca să vezi aici alertele ANMDMR."
            action={{ label: "Deschide catalogul", onPress: () => router.navigate("/(tabs)/(index)") }}
          />
        }
      />
    </>
  );
}
