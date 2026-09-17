import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { BoringAvatar } from "@/components/boring-avatar";
import { PressableScale } from "@/components/pressable-scale";
import { useSession } from "@/store/session";

/**
 * Aesthetic BoringAvatar button for the navigation bar / toolbar in all in-app tabs:
 * Azi, Medicamente, Radar, Comparator, Lista mea.
 */
export function AccountAvatarButton({ size = 30 }: { size?: number }) {
  const router = useRouter();
  const user = useSession((state) => state.user);

  const handlePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/account");
  };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={user ? "Contul meu" : "Cont"}
      accessibilityHint="Deschide panoul de cont"
      onPress={handlePress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <BoringAvatar
        name={user?.name ?? "Medora Guest"}
        email={user?.email}
        size={size}
      />
    </PressableScale>
  );
}

// Backwards-compatible hook if needed
export function useAccountButton() {
  const router = useRouter();
  const signedIn = useSession((state) => state.user !== null);

  return {
    icon: signedIn ? "person.crop.circle.fill" : "person.crop.circle",
    accessibilityLabel: signedIn ? "Contul meu" : "Cont",
    onPress: () => router.push("/account"),
  } as const;
}
