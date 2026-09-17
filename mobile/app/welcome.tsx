import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
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

function HeroCapsule() {
  const floatAnim = useRef(new RNAnimated.Value(0)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const pressScale = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    // 1. Continuous smooth 3D levitation using native iOS CoreAnimation driver
    const floatLoop = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(floatAnim, {
          toValue: -8,
          duration: 1800,
          easing: RNEasing.inOut(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
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
          toValue: 1.055,
          duration: 75,
          easing: RNEasing.out(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 0.985,
          duration: 65,
          easing: RNEasing.inOut(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1.025,
          duration: 75,
          easing: RNEasing.out(RNEasing.quad),
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 220,
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
  }, [floatAnim, pulseAnim]);

  const handlePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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
          top: 62,
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
            style={{ width: 84, height: 120 }}
            resizeMode="contain"
            accessibilityLabel="Flacon Medora 3D"
          />
        </RNAnimated.View>
      </PressableScale>
    </View>
  );
}

function AnimatedTitle() {
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
          entering={FadeInDown.duration(480).delay(100 + index * 75).springify().damping(13).stiffness(150)}
          style={{
            fontSize: 30,
            lineHeight: 38,
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

export default function WelcomeScreen() {
  const router = useRouter();
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
        <Animated.View entering={enter(0)} style={{ gap: Space.lg, alignItems: "center" }}>
          <HeroCapsule />
          <AnimatedTitle />

          <SearchField onSearch={(q) => getStarted(catalogHref(q))} />

          <Text style={{ ...Type.footnote, lineHeight: 18, color: Colors.secondaryLabel, textAlign: "center" }}>
            Catalogul medicamentelor autorizate în România{"\n"}Surse: ANMDMR, EMA · versiune demonstrativă
          </Text>
        </Animated.View>

        <Animated.View entering={enter(1)} style={{ flexDirection: "row", flexWrap: "wrap", rowGap: Space.lg }}>
          {MODULES.map((module, index) => {
            const available = module.href !== null;
            return (
              <Animated.View
                key={module.key}
                entering={FadeInDown.duration(520).delay(180 + index * 65).springify().damping(13)}
                style={{ width: "33.33%", alignItems: "center" }}
              >
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={available ? module.label : `${module.label}, în curând`}
                  accessibilityState={{ disabled: !available }}
                  disabled={!available}
                  onPress={() => module.href && getStarted(module.href)}
                  style={{ alignItems: "center", gap: 2 }}
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
              </Animated.View>
            );
          })}
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
