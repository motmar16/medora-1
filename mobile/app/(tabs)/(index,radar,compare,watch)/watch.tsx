import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { MedicineCard } from "@/components/medicine-card";
import { MEDICINES } from "@/constants/medicines";
import { Colors, Space, Type } from "@/constants/theme";
import { useWatchlist } from "@/store/watchlist";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card style={{ flex: 1, gap: 2 }}>
      <Text style={{ ...Type.title1, color: Colors.label, fontVariant: ["tabular-nums"] }}>{value}</Text>
      <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }}>{label}</Text>
    </Card>
  );
}

export default function WatchScreen() {
  const router = useRouter();
  const ids = useWatchlist((state) => state.ids);
  const watched = useMemo(() => MEDICINES.filter((m) => ids.includes(m.id)), [ids]);
  const activeAlerts = watched.filter((m) => m.status === "temporary" || m.status === "permanent").length;

  return (
    <FlashList
      data={watched}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MedicineCard medicine={item} />}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: Space.lg }}
      ItemSeparatorComponent={() => <View style={{ height: Space.md }} />}
      ListHeaderComponent={
        watched.length > 0 ? (
          <View style={{ gap: Space.xl, paddingBottom: Space.md }}>
            <View style={{ flexDirection: "row", gap: Space.md }}>
              <Stat value={watched.length} label="Urmărite" />
              <Stat value={activeAlerts} label="Alerte active" />
            </View>
            <Text style={{ ...Type.footnote, color: Colors.secondaryLabel, paddingHorizontal: Space.lg }}>
              Primești aici modificările de disponibilitate publicate de ANMDMR pentru produsele urmărite.
            </Text>
          </View>
        ) : null
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
  );
}
