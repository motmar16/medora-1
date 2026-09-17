import { useRouter } from "expo-router";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";

import { ActionButton } from "@/components/action-button";
import { useAmbientBackground } from "@/components/ambient-background";
import { BrandMark } from "@/components/brand-mark";
import { Colors, Motion, Radii, Space, Type } from "@/constants/theme";
import { useSession } from "@/store/session";

// Copy from the web landing's story section (index.html).
const FEATURES: { symbol: SFSymbol; title: string; body: string }[] = [
  {
    symbol: "waveform.path.ecg",
    title: "Vizibilitate instantă",
    body: "Status și istoric, împreună, pentru fiecare medicament.",
  },
  {
    symbol: "magnifyingglass",
    title: "Căutare asistată",
    body: "Din întrebare direct într-un răspuns clar și verificabil.",
  },
  {
    symbol: "checkmark.seal",
    title: "Decizii mai clare",
    body: "Fiecare informație legată de sursa ei oficială.",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const continueAsGuest = useSession((state) => state.continueAsGuest);
  const reduceMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  const background = useAmbientBackground();

  // First-launch moment: a short staggered entrance; Reduce Motion gets a plain fade.
  const enter = (index: number) =>
    reduceMotion
      ? FadeIn.duration(200)
      : FadeInDown.duration(460).delay(60 + index * 70).easing(Motion.easeOut);

  return (
    <View style={background}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          width: "100%",
          maxWidth: 560,
          alignSelf: "center",
          paddingHorizontal: Space.xxl,
          paddingTop: Space.lg,
          paddingBottom: Space.xxl,
          gap: Space.xxl + Space.sm,
        }}
      >
        <Animated.View entering={enter(0)} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <BrandMark size={34} />
          <Text style={{ fontSize: 28, fontWeight: "700", letterSpacing: -0.8, color: Colors.label }}>medora</Text>
        </Animated.View>

        <Animated.View entering={enter(1)} style={{ gap: Space.lg }}>
          <Text
            accessibilityRole="header"
            style={{ fontSize: 36, lineHeight: 40, fontWeight: "700", letterSpacing: -1, color: Colors.label }}
          >
            Informația potrivită.{"\n"}
            <Text style={{ color: Colors.accent }}>Înainte de prescripție.</Text>
          </Text>
          <Text style={{ ...Type.body, lineHeight: 24, color: Colors.secondaryLabel }}>
            Catalogul medicamentelor din România, alertele de discontinuitate ANMDMR și comparații de
            substituție, într-un singur loc.
          </Text>
        </Animated.View>

        <View style={{ gap: Space.lg + 2 }}>
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={enter(index + 2)}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: Space.lg }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: Radii.tile,
                  borderCurve: "continuous",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.surface,
                  boxShadow: "0 1px 3px rgba(24, 24, 23, 0.08)",
                }}
              >
                <SymbolView name={feature.symbol} size={20} weight="medium" tintColor={Colors.label} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ ...Type.headline, color: Colors.label }}>{feature.title}</Text>
                <Text style={{ ...Type.subhead, lineHeight: 20, color: Colors.secondaryLabel }}>{feature.body}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Actions stay pinned above the home indicator; the story scrolls if it doesn't fit. */}
      <Animated.View
        entering={enter(5)}
        style={{
          width: "100%",
          maxWidth: 560,
          alignSelf: "center",
          gap: Space.xs,
          paddingHorizontal: Space.xxl,
          paddingTop: Space.md,
          paddingBottom: Math.max(insets.bottom, Space.lg),
        }}
      >
        <ActionButton
          label="Creează cont gratuit"
          onPress={() => router.push({ pathname: "/sign-in", params: { mode: "signup" } })}
        />
        <ActionButton
          label="Am deja cont"
          variant="secondary"
          onPress={() => router.push({ pathname: "/sign-in", params: { mode: "signin" } })}
        />
        <ActionButton label="Continuă fără cont" variant="plain" onPress={continueAsGuest} />
        <Text
          style={{
            ...Type.caption,
            color: Colors.tertiaryLabel,
            textAlign: "center",
            marginTop: Space.xs,
          }}
        >
          Versiune demonstrativă · Surse: ANMDMR și EMA
        </Text>
      </Animated.View>
    </View>
  );
}
