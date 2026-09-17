import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { AlertCard } from "@/components/alert-card";
import { EmptyState } from "@/components/empty-state";
import { MEDICINES, type Medicine } from "@/constants/medicines";
import { Colors, Space, Type } from "@/constants/theme";

const FILTERS: { label: string; status?: Medicine["status"] }[] = [
  { label: "Toate" },
  { label: "Temporare", status: "temporary" },
  { label: "Retrase", status: "permanent" },
  { label: "Reluate", status: "resumed" },
];

export default function RadarScreen() {
  const [filterIndex, setFilterIndex] = useState(0);

  const alerts = useMemo(() => {
    const { status } = FILTERS[filterIndex];
    return MEDICINES.filter((m) => m.event && (!status || m.status === status));
  }, [filterIndex]);

  return (
    <FlashList
      data={alerts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AlertCard medicine={item} />}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: Space.lg }}
      ItemSeparatorComponent={() => <View style={{ height: Space.md }} />}
      ListHeaderComponent={
        <View style={{ gap: Space.md, paddingBottom: Space.lg }}>
          <Text style={{ ...Type.footnote, color: Colors.secondaryLabel }}>
            Notificări ANMDMR privind disponibilitatea medicamentelor în România.
          </Text>
          <SegmentedControl
            values={FILTERS.map((f) => f.label)}
            selectedIndex={filterIndex}
            onChange={(event) => setFilterIndex(event.nativeEvent.selectedSegmentIndex)}
          />
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          symbol="checkmark.shield"
          title="Nicio alertă"
          message="Nu există notificări de discontinuitate pentru filtrul ales."
        />
      }
    />
  );
}
