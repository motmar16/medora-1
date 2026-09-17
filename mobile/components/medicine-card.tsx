import { Link } from "expo-router";
import { Text, View } from "react-native";

import { BookmarkButton } from "@/components/bookmark-button";
import { cardStyle } from "@/components/card";
import { PressableScale } from "@/components/pressable-scale";
import { StatusBadge } from "@/components/status-badge";
import type { Medicine } from "@/constants/medicines";
import { Colors, Radii, Space, Type } from "@/constants/theme";
import { useWatchlist } from "@/store/watchlist";

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const saved = useWatchlist((state) => state.ids.includes(medicine.id));
  const toggle = useWatchlist((state) => state.toggle);

  return (
    <Link href={{ pathname: "/medicine/[id]", params: { id: medicine.id } }} asChild>
      <Link.Trigger>
        <PressableScale style={cardStyle}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: Space.sm }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ ...Type.headline, color: Colors.label }} numberOfLines={1}>
                {medicine.name}{" "}
                <Text style={{ ...Type.subhead, color: Colors.secondaryLabel }}>{medicine.strength}</Text>
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: Space.sm }}>
                <Text style={{ ...Type.subhead, color: Colors.secondaryLabel }}>{medicine.dci}</Text>
                <View
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    borderRadius: Radii.tag,
                    borderCurve: "continuous",
                    backgroundColor: Colors.fill,
                  }}
                >
                  <Text
                    style={{
                      ...Type.caption,
                      fontWeight: "600",
                      color: Colors.secondaryLabel,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {medicine.atc}
                  </Text>
                </View>
              </View>
            </View>
            <BookmarkButton id={medicine.id} />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: Space.sm }}>
            <StatusBadge status={medicine.status} />
            <Text style={{ ...Type.caption, color: Colors.tertiaryLabel, flexShrink: 1 }} numberOfLines={1}>
              {medicine.form} · {medicine.prescriptionType}
            </Text>
          </View>
        </PressableScale>
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction
          title={saved ? "Nu mai urmări" : "Urmărește"}
          icon={saved ? "bookmark.slash" : "bookmark"}
          onPress={() => toggle(medicine.id)}
        />
      </Link.Menu>
    </Link>
  );
}
