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
import { ECGHorizon } from "@/components/ecg-horizon";
import { useAmbientBackground } from "@/components/ambient-background";
import { PressableScale } from "@/components/pressable-scale";
import { SearchField } from "@/components/search-field";
import { catalogHref, MODULES } from "@/constants/modules";
import { Colors, Motion, Space, Type } from "@/constants/theme";
import { useSession } from "@/store/session";

function HeroCapsule({ size, ecgTop }: { size: number; ecgTop: number }) {
  const reduceMotion = useReducedMotion();
  const floatAnim = useRef(new RNAnimated.Value(0)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const pressScale = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    // Reduce Motion: the flacon sits still instead of floating and pulsing.
    if (reduceMotion) return;

    // 1. Continuous smooth 3D levitation using native iOS CoreAnimation driver
    const floatLoop = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(floatAnim, {
          toValue: -9,
          duration: 2400,
          easing: RNEasing.inOut(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(floatAnim, {
          toValue: 0,
          duration: 2400,
          easing: RNEasing.inOut(RNEasing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    // 2. Cardiac pulse (lub-dub) synchronized with the ECG heartbeat wave
    const pulseLoop = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.delay(600),
        RNAnimated.timing(pulseAnim, {
          toValue: 1.022,
          duration: 140,
          easing: RNEasing.out(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 0.994,
          duration: 130,
          easing: RNEasing.inOut(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1.012,
          duration: 140,
          easing: RNEasing.out(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 320,
          easing: RNEasing.out(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.delay(165),
      ])
    );
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [floatAnim, pulseAnim, reduceMotion]);

  const handlePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (reduceMotion) return;
    RNAnimated.sequence([
      RNAnimated.spring(pressScale, {
        toValue: 1.18,
        damping: 6,
        stiffness: 350,
        useNativeDriver: true,
      }),
      RNAnimated.spring(pressScale, {
        toValue: 1,
        damping: 9,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const combinedScale = RNAnimated.multiply(pulseAnim, pressScale);

  return (
    <View style={{ alignItems: "center", position: "relative", marginBottom: Space.xs }}>
      {/* Grounded Vital Horizon ECG line continuously flowing behind the flacon */}
      <ECGHorizon
        style={{
          position: "absolute",
          top: ecgTop,
          zIndex: 1,
        }}
      />

      <PressableScale onPress={handlePress} style={{ zIndex: 2, alignItems: "center" }}>
        <RNAnimated.View
          style={{
            transform: [
              { translateY: floatAnim },
              { scale: combinedScale },
            ],
          }}
        >
          <Image
            source={require("@/assets/images/capsule-hero.png")}
            style={{ width: size * 0.7, height: size }}
            resizeMode="contain"
            accessibilityLabel="Flacon Medora 3D"
          />
        </RNAnimated.View>
      </PressableScale>
    </View>
  );
}

function AnimatedTitle({ fontSize, lineHeight }: { fontSize: number; lineHeight: number }) {
  const words = ["Găsește", "rapid", "informații", "despre", "medicamente"];
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingHorizontal: Space.sm,
      }}
      accessibilityRole="header"
      accessibilityLabel="Găsește rapid informații despre medicamente"
    >
      {words.map((word, index) => (
        <Animated.Text
          key={index}
          maxFontSizeMultiplier={1.5}
          entering={FadeInDown.duration(480).delay(100 + index * 75).springify().damping(13).stiffness(150)}
          style={{
            fontSize,
            lineHeight,
            fontWeight: "700",
            letterSpacing: -0.8,
            textAlign: "center",
            color: Colors.label,
            marginRight: 7,
          }}
        >
          {word}
        </Animated.Text>
      ))}
    </View>
  );
}

// Welcome must fit one screen at any Dynamic Type size: measure, then step down.
const DENSITIES = [
  { hero: 104, ecgTop: 52, icon: 76, gap: Space.lg, title: 30, titleLine: 38 },
  { hero: 88, ecgTop: 44, icon: 62, gap: Space.md, title: 26, titleLine: 33 },
  { hero: 72, ecgTop: 36, icon: 52, gap: Space.sm, title: 23, titleLine: 29 },
  { hero: 58, ecgTop: 28, icon: 44, gap: Space.xs, title: 21, titleLine: 26 },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [density, setDensity] = useState(0);
  const viewportHeight = useRef(0);
  const step = DENSITIES[density];
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
        onLayout={(event) => {
          viewportHeight.current = event.nativeEvent.layout.height;
        }}
        onContentSizeChange={(_, contentHeight) => {
          // Larger text pushes the module grid under the pinned actions: tighten a step.
          if (viewportHeight.current && contentHeight > viewportHeight.current + 1 && density < DENSITIES.length - 1) {
            setDensity((value) => value + 1);
          }
        }}
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
        <Animated.View entering={enter(0)} style={{ gap: step.gap, alignItems: "center" }}>
          <HeroCapsule size={step.hero} ecgTop={step.ecgTop} />
          <AnimatedTitle fontSize={step.title} lineHeight={step.titleLine} />

          <SearchField onSearch={(q) => getStarted(catalogHref(q))} />

          <Text
            maxFontSizeMultiplier={1.3}
            style={{ ...Type.footnote, lineHeight: 18, color: Colors.secondaryLabel, textAlign: "center" }}
          >
            Catalogul medicamentelor autorizate în România · Surse: ANMDMR, EMA · versiune demonstrativă
          </Text>
        </Animated.View>

        <Animated.View entering={enter(1)} style={{ flexDirection: "row", flexWrap: "wrap", rowGap: Space.lg }}>
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
