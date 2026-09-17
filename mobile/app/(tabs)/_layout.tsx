import { NativeTabs } from "expo-router/unstable-native-tabs";

import { MEDICINES } from "@/constants/medicines";
import { Colors } from "@/constants/theme";
import { useWatchlist } from "@/store/watchlist";

export default function TabsLayout() {
  const activeAlerts = useWatchlist(
    (state) =>
      MEDICINES.filter(
        (m) => state.ids.includes(m.id) && (m.status === "temporary" || m.status === "permanent")
      ).length
  );

  return (
    <NativeTabs tintColor={Colors.accent} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(index)">
        <NativeTabs.Trigger.Icon sf={{ default: "pills", selected: "pills.fill" }} md="medication" />
        <NativeTabs.Trigger.Label>Medicamente</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(radar)">
        <NativeTabs.Trigger.Icon sf="waveform.path.ecg" md="monitor_heart" />
        <NativeTabs.Trigger.Label>Radar alerte</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(compare)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "arrow.left.arrow.right.square", selected: "arrow.left.arrow.right.square.fill" }}
          md="compare_arrows"
        />
        <NativeTabs.Trigger.Label>Comparator</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(watch)">
        <NativeTabs.Trigger.Icon sf={{ default: "bookmark", selected: "bookmark.fill" }} md="bookmark" />
        <NativeTabs.Trigger.Label>Lista mea</NativeTabs.Trigger.Label>
        {activeAlerts > 0 && <NativeTabs.Trigger.Badge>{String(activeAlerts)}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
