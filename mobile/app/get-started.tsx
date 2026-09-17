import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";

import { ActionButton } from "@/components/action-button";
import { BrandMark } from "@/components/brand-mark";
import { Colors, Space, Type } from "@/constants/theme";
import { useSession } from "@/store/session";

// Short interruption from Welcome: account or guest, then land where the user tapped.
export default function GetStartedSheet() {
  const router = useRouter();
  const { href } = useLocalSearchParams<{ href?: string }>();
  const continueAsGuest = useSession((state) => state.continueAsGuest);
  const choseGuest = useRef(false);

  // Leaving Welcome flips the root stack guard; do it after this sheet has dismissed.
  useEffect(
    () => () => {
      if (choseGuest.current) continueAsGuest(href);
    },
    [continueAsGuest, href]
  );

  return (
    <View style={{ padding: Space.xxl, paddingTop: Space.xxl + Space.sm, gap: Space.lg }}>
      <View style={{ alignItems: "center", gap: Space.md }}>
        <BrandMark size={48} />
        <Text style={{ ...Type.title3, color: Colors.label, textAlign: "center" }}>Cum vrei să continui?</Text>
        <Text style={{ ...Type.subhead, lineHeight: 20, color: Colors.secondaryLabel, textAlign: "center" }}>
          Cu un cont îți păstrezi Lista mea pe toate dispozitivele și primești alertele ANMDMR.
        </Text>
      </View>

      <View style={{ gap: Space.sm }}>
        <ActionButton
          label="Conectează-te sau creează cont"
          onPress={() => router.replace({ pathname: "/sign-in", params: { mode: "signin", href } })}
        />
        <ActionButton
          label="Continuă fără cont"
          variant="secondary"
          onPress={() => {
            choseGuest.current = true;
            router.back();
          }}
        />
      </View>

      <Text style={{ ...Type.caption, color: Colors.tertiaryLabel, textAlign: "center" }}>
        Poți crea un cont oricând din Lista mea.
      </Text>
    </View>
  );
}
