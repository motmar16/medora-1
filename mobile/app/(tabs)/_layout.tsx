import { useRouter, type Href } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useEffect } from "react";

import { MEDICINES } from "@/constants/medicines";
import { Colors } from "@/constants/theme";
import { useSession } from "@/store/session";
import { useWatchlist } from "@/store/watchlist";

export default function TabsLayout() {
  const router = useRouter();

  // Coming from Welcome: open the module or search the user tapped there.
  useEffect(() => {
    const href = useSession.getState().takePendingHref();
    if (!href) return;
    // Wait for the first layout pass; switching tabs mid-layout collapses the large title.
    const timer = setTimeout(() => router.navigate(href as Href), 250);
    return () => clearTimeout(timer);
  }, [router]);

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
