import React, { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useReducedMotion,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionButton } from "@/components/action-button";
import { BoringAvatar } from "@/components/boring-avatar";
import { ECGHorizon } from "@/components/ecg-horizon";
import { useAmbientBackground } from "@/components/ambient-background";
import { PressableScale } from "@/components/pressable-scale";
import { SearchField } from "@/components/search-field";
import { catalogHref, MODULES } from "@/constants/modules";
import { Colors, Motion, Space, Type } from "@/constants/theme";
import { useSession } from "@/store/session";


function HeroCapsule() {
  const floatY = useSharedValue(0);
  const userScale = useSharedValue(1);
  const heartbeatScale = useSharedValue(1);

  React.useEffect(() => {
    // 1. Continuous smooth 3D levitation (unconditional, silky smooth)
    floatY.value = withRepeat(
      withTiming(-8, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    // 2. Cardiac pulse (lub-dub) synchronized with the 1200ms ECG heartbeat wave
    heartbeatScale.value = withRepeat(
      withSequence(
        withDelay(
          600,
          withSequence(
            withTiming(1.055, { duration: 75, easing: Easing.out(Easing.quad) }),
            withTiming(0.985, { duration: 65, easing: Easing.inOut(Easing.quad) }),
            withTiming(1.025, { duration: 75, easing: Easing.out(Easing.quad) }),
            withTiming(1.0, { duration: 220, easing: Easing.out(Easing.quad) })
          )
        ),
        withDelay(165, withTiming(1.0, { duration: 0 }))
      ),
      -1,
      false
    );
  }, [floatY, heartbeatScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: userScale.value * heartbeatScale.value },
    ],
  }));

  const handlePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    userScale.value = withSequence(
      withSpring(1.18, { damping: 6, stiffness: 350 }),
      withSpring(1, { damping: 9, stiffness: 200 })
    );
  };

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
        <Animated.View style={animatedStyle}>
          <Image
            source={require("@/assets/images/capsule-hero.png")}
            style={{ width: 84, height: 120 }}
            resizeMode="contain"
            accessibilityLabel="Flacon Medora 3D"
          />
        </Animated.View>
      </PressableScale>
    </View>
  );
}


function AnimatedTitle({ reduceMotion }: { reduceMotion: boolean }) {
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
      {words.map((word, index) => {
        const wordEntrance = reduceMotion
          ? FadeIn.duration(200)
          : FadeInDown.duration(480).delay(100 + index * 75).springify().damping(13).stiffness(150);
        return (
          <Animated.Text
            key={index}
            entering={wordEntrance}
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
        );
      })}
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  const background = useAmbientBackground();
  const user = useSession((state) => state.user);
  const continueAsGuest = useSession((state) => state.continueAsGuest);

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


        <Animated.View entering={enter(0)} style={{ flexDirection: "row", justifyContent: "flex-end", width: "100%", marginBottom: -Space.lg }}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={user ? "Contul meu" : "Cont"}
            accessibilityHint="Deschide panoul de cont"
            onPress={() => {
              if (process.env.EXPO_OS === "ios") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              router.push("/account");
            }}
            style={{ padding: Space.xs }}
          >
            <BoringAvatar
              name={user?.name ?? "Medora Guest"}
              email={user?.email}
              size={38}
            />
          </PressableScale>
        </Animated.View>

        <Animated.View entering={enter(1)} style={{ gap: Space.lg, alignItems: "center" }}>
          <HeroCapsule />
          <AnimatedTitle reduceMotion={Boolean(reduceMotion)} />

          <SearchField onSearch={(q) => getStarted(catalogHref(q))} />

          <Text style={{ ...Type.footnote, lineHeight: 18, color: Colors.secondaryLabel, textAlign: "center" }}>
            Catalogul medicamentelor autorizate în România{"\n"}Surse: ANMDMR, EMA · versiune demonstrativă
          </Text>
        </Animated.View>

        <Animated.View entering={enter(2)} style={{ flexDirection: "row", flexWrap: "wrap", rowGap: Space.lg }}>
          {MODULES.map((module, index) => {
            const available = module.href !== null;
            const tileEntrance = reduceMotion ? FadeIn.duration(200) : FadeInDown.duration(520).delay(180 + index * 65).springify().damping(13);
            return (
              <Animated.View key={module.key} entering={tileEntrance} style={{ width: "33.33%", alignItems: "center" }}>
            const available = module.href !== null;
            return (
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
          variant="secondary"
          onPress={() => router.push({ pathname: "/sign-in", params: { mode: "signin" } })}
        />
        <ActionButton label="Continuă fără cont" variant="plain" onPress={() => continueAsGuest()} />
      </Animated.View>
    </View>
  );
}
