import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionButton } from "@/components/action-button";
import { useAmbientBackground } from "@/components/ambient-background";
import { BrandMark } from "@/components/brand-mark";
import { PressableScale } from "@/components/pressable-scale";
import { catalogHref, MODULES } from "@/constants/modules";
import { Colors, Motion, Radii, Space, Type } from "@/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  const background = useAmbientBackground();
  // Uncontrolled input: the value is only read when searching.
  const query = useRef("");

  // Every entry point into the app asks once: account or guest.
  const getStarted = (href: string) => router.push({ pathname: "/get-started", params: { href } });

  // First-launch moment: a short staggered entrance; Reduce Motion gets a plain fade.
  const enter = (index: number) =>
    reduceMotion
      ? FadeIn.duration(200)
      : FadeInDown.duration(460).delay(60 + index * 70).easing(Motion.easeOut);

  return (
    // The scroll view starts below the status bar: if it runs under it, iOS 26+ draws a scroll edge divider there.
    <View style={[background, { paddingTop: insets.top }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          width: "100%",
          maxWidth: 560,
          alignSelf: "center",
          paddingHorizontal: Space.xl,
          paddingTop: Space.sm,
          paddingBottom: Space.xxl,
          gap: Space.xxl,
        }}
      >
        <Animated.View entering={enter(0)} accessible accessibilityLabel="Medora" style={{ alignSelf: "flex-start" }}>
          <BrandMark size={32} />
        </Animated.View>

        <Animated.View entering={enter(1)} style={{ gap: Space.lg }}>
          <Text
            accessibilityRole="header"
            style={{
              fontSize: 30,
              lineHeight: 36,
              fontWeight: "700",
              letterSpacing: -0.8,
              textAlign: "center",
              color: Colors.label,
            }}
          >
            Găsește rapid informații despre medicamente
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Space.sm,
              minHeight: 58,
              paddingLeft: Space.lg,
              paddingRight: 6,
              borderRadius: Radii.pill,
              backgroundColor: Colors.surface,
              boxShadow: "0 6px 20px rgba(24, 24, 23, 0.10)",
            }}
          >
            <SymbolView name="magnifyingglass" size={18} tintColor={Colors.secondaryLabel} />
            <TextInput
              placeholder="Medicament, DCI, ATC"
              placeholderTextColor={Colors.tertiaryLabel}
              onChangeText={(text) => (query.current = text)}
              onSubmitEditing={() => getStarted(catalogHref(query.current))}
              returnKeyType="search"
              autoCorrect={false}
              style={{ ...Type.callout, flex: 1, minHeight: 44, color: Colors.label }}
            />
            <PressableScale
              accessibilityRole="button"
              onPress={() => getStarted(catalogHref(query.current))}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                minHeight: 46,
                paddingHorizontal: Space.lg,
                borderRadius: Radii.pill,
                backgroundColor: Colors.primary,
              }}
            >
              <Text style={{ ...Type.subhead, fontWeight: "600", color: Colors.onPrimary }}>Caută</Text>
              <SymbolView name="arrow.right" size={13} weight="semibold" tintColor={Colors.onPrimary} />
            </PressableScale>
          </View>

          <Text style={{ ...Type.footnote, lineHeight: 18, color: Colors.secondaryLabel, textAlign: "center" }}>
            Catalogul medicamentelor autorizate în România{"\n"}Surse: ANMDMR, EMA · versiune demonstrativă
          </Text>
        </Animated.View>

        <Animated.View entering={enter(2)} style={{ flexDirection: "row", flexWrap: "wrap", rowGap: Space.lg }}>
          {MODULES.map((module) => {
            const available = module.href !== null;
            return (
              <PressableScale
                key={module.key}
                accessibilityRole="button"
                accessibilityLabel={available ? module.label : `${module.label}, în curând`}
                accessibilityState={{ disabled: !available }}
                disabled={!available}
                onPress={() => module.href && getStarted(module.href)}
                style={{ width: "33.33%", alignItems: "center", gap: 2 }}
              >
                <Image
                  source={module.icon}
                  style={{ width: 84, height: 84, opacity: available ? 1 : 0.45 }}
                  accessibilityIgnoresInvertColors
                />
                <Text
                  style={{
                    ...Type.subhead,
                    fontWeight: "500",
                    color: available ? Colors.label : Colors.tertiaryLabel,
                  }}
                >
                  {module.label}
                </Text>
                {!available && (
                  <Text style={{ ...Type.caption, color: Colors.tertiaryLabel, marginTop: -2 }}>În curând</Text>
                )}
              </PressableScale>
            );
          })}
        </Animated.View>
      </ScrollView>

      {/* Actions stay pinned above the home indicator; the content scrolls if it doesn't fit. */}
      <Animated.View
        entering={enter(3)}
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
          variant="plain"
          onPress={() => router.push({ pathname: "/sign-in", params: { mode: "signin" } })}
        />
      </Animated.View>
    </View>
  );
}
