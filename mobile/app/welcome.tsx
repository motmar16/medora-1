import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionButton } from "@/components/action-button";
import { useAmbientBackground } from "@/components/ambient-background";
import { BrandMark } from "@/components/brand-mark";
import { PressableScale } from "@/components/pressable-scale";
import { catalogHref, FREQUENT_SEARCHES, MODULES } from "@/constants/modules";
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
    <View style={background}>
      {/* Insets handled here: the automatic behavior makes iOS draw a scroll edge under the status bar. */}
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          width: "100%",
          maxWidth: 560,
          alignSelf: "center",
          paddingHorizontal: Space.xl,
          paddingTop: insets.top + Space.xl,
          paddingBottom: Space.xxl,
          gap: Space.xxl,
        }}
      >
        <Animated.View entering={enter(0)} style={{ alignItems: "center", gap: Space.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <BrandMark size={38} />
            <Text style={{ fontSize: 32, fontWeight: "700", letterSpacing: -1, color: Colors.label }}>medora</Text>
          </View>
          <Text
            accessibilityRole="header"
            style={{
              fontSize: 30,
              lineHeight: 34,
              fontWeight: "700",
              letterSpacing: -0.8,
              textAlign: "center",
              color: Colors.label,
            }}
          >
            Informația potrivită.{"\n"}
            <Text style={{ color: Colors.accent }}>Înainte de prescripție.</Text>
          </Text>
        </Animated.View>

        <Animated.View entering={enter(1)} style={{ gap: Space.md }}>
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
              placeholder="Medicament, DCI sau cod ATC"
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

          <Text style={{ ...Type.footnote, color: Colors.secondaryLabel, textAlign: "center", marginTop: Space.xs }}>
            Frecvent căutate
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: Space.sm, marginTop: -Space.xs }}>
            {FREQUENT_SEARCHES.map((term) => (
              <PressableScale
                key={term}
                accessibilityRole="button"
                onPress={() => getStarted(catalogHref(term))}
                style={{
                  minHeight: 32,
                  justifyContent: "center",
                  paddingHorizontal: Space.md,
                  borderRadius: Radii.pill,
                  backgroundColor: Colors.surface,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: Colors.separator,
                }}
              >
                <Text style={{ ...Type.footnote, fontWeight: "500", color: Colors.label }}>{term}</Text>
              </PressableScale>
            ))}
          </View>
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
        <Text style={{ ...Type.caption, color: Colors.tertiaryLabel, textAlign: "center" }}>
          Versiune demonstrativă · Surse: ANMDMR și EMA
        </Text>
      </Animated.View>
    </View>
  );
}
