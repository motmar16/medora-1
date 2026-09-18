import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated as RNAnimated,
  Easing as RNEasing,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useReducedMotion,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionButton } from "@/components/action-button";
import { useAmbientBackground } from "@/components/ambient-background";
import { PressableScale } from "@/components/pressable-scale";
import { SearchField } from "@/components/search-field";
import { catalogHref, MODULES } from "@/constants/modules";
import { Colors, Motion, Space, Type } from "@/constants/theme";
import { useSession } from "@/store/session";

function HeroCapsule({ size }: { size: number }) {
  const reduceMotion = useReducedMotion();
  const lift = useRef(new RNAnimated.Value(0)).current;
  const pressScale = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    // Reduce Motion: the flacon simply rests.
    if (reduceMotion) return;

    // Subtle levitation: one slow rise and fall, with a touch of scale for depth.
    const float = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(lift, {
          toValue: 1,
          duration: 2300,
          easing: RNEasing.inOut(RNEasing.sin),
          useNativeDriver: true,
        }),
        RNAnimated.timing(lift, {
          toValue: 0,
          duration: 2300,
          easing: RNEasing.inOut(RNEasing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    float.start();
    return () => float.stop();
  }, [lift, reduceMotion]);

  const handlePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (reduceMotion) return;
    RNAnimated.sequence([
      RNAnimated.spring(pressScale, { toValue: 1.1, damping: 7, stiffness: 320, useNativeDriver: true }),
      RNAnimated.spring(pressScale, { toValue: 1, damping: 9, stiffness: 200, useNativeDriver: true }),
    ]).start();
  };

  const translateY = lift.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const breathe = lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] });
  const scale = RNAnimated.multiply(breathe, pressScale);

  return (
    <PressableScale onPress={handlePress} style={{ alignItems: "center" }}>
      <RNAnimated.View style={{ transform: [{ translateY }, { scale }] }}>
        <Image
          source={require("@/assets/images/capsule-hero.png")}
          style={{ width: size * 0.7, height: size }}
          resizeMode="contain"
          accessibilityLabel="Flacon Medora"
        />
      </RNAnimated.View>
    </PressableScale>
  );
}

function AnimatedTitle({ fontSize, lineHeight }: { fontSize: number; lineHeight: number }) {
  // One text block, not one box per word: words in separate boxes get clipped once the
  // system text size grows. The line still animates in with the rest of the screen.
  return (
    <Animated.Text
      accessibilityRole="header"
      entering={FadeInDown.duration(520).delay(120).springify().damping(14).stiffness(150)}
      style={{
        alignSelf: "stretch",
        paddingHorizontal: Space.sm,
        fontSize,
        lineHeight,
        fontWeight: "700",
        letterSpacing: -0.8,
        textAlign: "center",
        color: Colors.label,
      }}
    >
      Găsește rapid informații despre medicamente
    </Animated.Text>
  );
}

// Welcome must fit one screen at any Dynamic Type size: measure, then step down.
// Icons and headline keep their size; only the decorative flacon and the spacing give way,
// so a tight screen never shrinks what people actually read and tap.
const DENSITIES = [
  { hero: 104, icon: 76, gap: Space.lg, title: 30, titleLine: 38 },
  { hero: 88, icon: 76, gap: Space.md, title: 30, titleLine: 38 },
  { hero: 72, icon: 76, gap: Space.sm, title: 30, titleLine: 38 },
  { hero: 56, icon: 76, gap: Space.xs, title: 30, titleLine: 38 },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [density, setDensity] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);
  const step = DENSITIES[density];

  // Natural height of the two blocks plus the gaps around the spacer between them.
  const naturalHeight = headerHeight + gridHeight + step.gap * 2 + Space.sm * 2;
  const measured = viewportHeight > 0 && headerHeight > 0 && gridHeight > 0;
  const overflows = measured && naturalHeight > viewportHeight + 1;
  // Push the module grid down into the empty area instead of leaving a hole above the actions.
  const spacerHeight = measured && !overflows ? (viewportHeight - naturalHeight) * 0.62 : 0;

  useEffect(() => {
    if (overflows && density < DENSITIES.length - 1) setDensity((value) => value + 1);
  }, [overflows, density]);
  const reduceMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  const background = useAmbientBackground();
  const continueAsGuest = useSession((state) => state.continueAsGuest);

  // Every entry point into the app asks once: account or guest.
  const getStarted = (href: string) => router.push({ pathname: "/get-started", params: { href } });

  const enter = (index: number) =>
    reduceMotion
      ? FadeIn.duration(200)
      : FadeInDown.duration(460).delay(60 + index * 70).easing(Motion.easeOut);

  return (
    <View style={[background, { paddingTop: insets.top }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
        contentContainerStyle={{
          width: "100%",
          maxWidth: 560,
          alignSelf: "center",
          paddingHorizontal: Space.xl,
          paddingTop: Space.sm,
          paddingBottom: Space.sm,
          gap: step.gap,
        }}
      >
        <Animated.View
          entering={enter(0)}
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
          style={{ gap: step.gap, alignItems: "center" }}
        >
          <HeroCapsule size={step.hero} />
          <AnimatedTitle fontSize={step.title} lineHeight={step.titleLine} />

          <SearchField onSearch={(q) => getStarted(catalogHref(q))} />

          <Text
            maxFontSizeMultiplier={1.3}
            style={{
              ...Type.footnote,
              width: "100%",
              lineHeight: 18,
              color: Colors.secondaryLabel,
              textAlign: "center",
            }}
          >
            Catalogul medicamentelor autorizate în România · Surse: ANMDMR, EMA · versiune demonstrativă
          </Text>
        </Animated.View>

        <View style={{ height: spacerHeight }} />

        <Animated.View
          entering={enter(1)}
          onLayout={(event) => setGridHeight(event.nativeEvent.layout.height)}
          style={{ flexDirection: "row", flexWrap: "wrap", rowGap: step.gap }}
        >
          {MODULES.map((module, index) => (
            <Animated.View
              key={module.key}
              entering={FadeInDown.duration(520).delay(180 + index * 65).springify().damping(13)}
              style={{ width: "33.33%", alignItems: "center" }}
            >
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={module.label}
                onPress={() =>
                  module.href
                    ? getStarted(module.href)
                    : // No screen behind this one yet: say so instead of doing nothing.
                      Alert.alert(
                        "Instrumente",
                        "Calculatoare clinice, verificator de interacțiuni și finder de substituție. Disponibile în curând."
                      )
                }
                style={{ alignItems: "center", gap: 2 }}
              >
                <Image
                  source={module.icon}
                  style={{ width: step.icon, height: step.icon }}
                  accessibilityIgnoresInvertColors
                />
                <Text
                  maxFontSizeMultiplier={1.4}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ ...Type.subhead, fontWeight: "500", color: Colors.label }}
                >
                  {module.label}
                </Text>
              </PressableScale>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Actions stay pinned above the home indicator */}
      <Animated.View
        entering={enter(2)}
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
        <ActionButton label="Continuă fără cont" variant="plain" onPress={() => continueAsGuest()} />
      </Animated.View>
    </View>
  );
}
