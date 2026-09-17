import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";

import { PressableScale } from "@/components/pressable-scale";
import { Colors } from "@/constants/theme";
import { useWatchlist } from "@/store/watchlist";

export function BookmarkButton({ id }: { id: string }) {
  const saved = useWatchlist((state) => state.ids.includes(id));
  const toggle = useWatchlist((state) => state.toggle);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={saved ? "Nu mai urmări" : "Urmărește"}
      accessibilityState={{ selected: saved }}
      hitSlop={8}
      onPress={() => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        toggle(id);
      }}
      style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}
    >
      <SymbolView
        name={saved ? "bookmark.fill" : "bookmark"}
        size={20}
        tintColor={saved ? Colors.accent : Colors.tertiaryLabel}
      />
    </PressableScale>
  );
}
