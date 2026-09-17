import { Link } from "expo-router";
import { Text, View } from "react-native";

import { cardStyle } from "@/components/card";
import { PressableScale } from "@/components/pressable-scale";
import { StatusBadge } from "@/components/status-badge";
import type { Medicine } from "@/constants/medicines";
import { Colors, Space, Type } from "@/constants/theme";

export function AlertCard({ medicine }: { medicine: Medicine }) {
  return (
    <Link href={{ pathname: "/medicine/[id]", params: { id: medicine.id } }} asChild>
      <Link.Trigger>
        <PressableScale style={cardStyle}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <StatusBadge status={medicine.status} />
            <Text style={{ ...Type.caption, color: Colors.tertiaryLabel, fontVariant: ["tabular-nums"] }}>
              {medicine.date}
            </Text>
          </View>

          <View style={{ gap: 2 }}>
            <Text style={{ ...Type.headline, color: Colors.label }} numberOfLines={1}>
              {medicine.name}{" "}
              <Text style={{ ...Type.subhead, color: Colors.secondaryLabel }}>{medicine.strength}</Text>
            </Text>
            <Text style={{ ...Type.subhead, color: Colors.secondaryLabel }}>{medicine.dci}</Text>
          </View>

          {medicine.note && (
            <Text style={{ ...Type.subhead, color: Colors.label, lineHeight: 20 }}>{medicine.note}</Text>
          )}
        </PressableScale>
      </Link.Trigger>
      <Link.Preview />
    </Link>
  );
}
