import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState, type Ref } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { ActionButton } from "@/components/action-button";
import { RiveEmptyState } from "@/components/rive-empty-state";
import { BrandMark } from "@/components/brand-mark";
import { Colors, Radii, Space, Type } from "@/constants/theme";
import { useSession, type SessionUser } from "@/store/session";

type Mode = "signup" | "signin";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// "andrei.popescu@spital.ro" -> "Andrei Popescu" until the profile has a real name.
function nameFromEmail(email: string) {
  return email
    .trim()
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function Field({ label, inputRef, ...input }: TextInputProps & { label: string; inputRef?: Ref<TextInput> }) {
  return (
    <View style={{ gap: Space.xs + 2 }}>
      <Text style={{ ...Type.footnote, fontWeight: "600", color: Colors.secondaryLabel }}>{label}</Text>
      <TextInput
        ref={inputRef}
        placeholderTextColor={Colors.tertiaryLabel}
        {...input}
        style={[
          {
            ...Type.body,
            minHeight: 50,
            paddingHorizontal: Space.lg,
            borderRadius: Radii.tile,
            borderCurve: "continuous",
            backgroundColor: Colors.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: Colors.separator,
            color: Colors.label,
          },
          input.style,
        ]}
      />
    </View>
  );
}

export default function SignInScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: Mode; href?: string }>();
  const signIn = useSession((state) => state.signIn);

  const [mode, setMode] = useState<Mode>(params.mode === "signin" ? "signin" : "signup");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const emailRef = useRef<TextInput>(null);
  const signedInUser = useRef<SessionUser | null>(null);

  // Signing in can flip the Welcome guard in the root stack. Doing that while this modal is
  // still mounted rebuilds the stack underneath it, so the session is committed on unmount,
  // after the dismissal has finished.
  useEffect(
    () => () => {
      if (signedInUser.current) signIn(signedInUser.current, params.href);
    },
    [signIn, params.href]
  );

  const emailValid = EMAIL.test(email.trim());
  const canSendCode = emailValid && (mode === "signin" || name.trim().length > 1);

  const finish = (user: SessionUser) => {
    if (process.env.EXPO_OS === "ios") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    signedInUser.current = user;
    setStep("success");
    setTimeout(() => {
      router.back();
    }, 1200);
  };

  // Mock providers: the flow is final, the network calls come with the auth backend.
  const withProvider = (provider: "apple" | "google") =>
    finish(
      provider === "apple"
        ? { name: "Cont Apple", email: "ascuns@privaterelay.appleid.com", provider }
        : { name: "Cont Google", email: "utilizator@gmail.com", provider }
    );

  return (
    <>
      <Stack.Screen options={{ title: mode === "signup" ? "Creează cont" : "Autentificare" }} />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" accessibilityLabel="Închide" onPress={() => router.back()} />
      </Stack.Toolbar>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{
          width: "100%",
          maxWidth: 520,
          alignSelf: "center",
          padding: Space.xxl,
          gap: Space.xl,
        }}
      >
        <View style={{ alignItems: "center", gap: Space.md }}>
          <BrandMark size={56} />
          <Text style={{ ...Type.subhead, lineHeight: 20, color: Colors.secondaryLabel, textAlign: "center" }}>
            {mode === "signup"
              ? "Salvează medicamente și monitorizează alertele oficiale."
              : "Bine ai revenit. Lista ta te așteaptă."}
          </Text>
        </View>

        {step !== "success" && (
          <SegmentedControl
            values={["Înregistrare", "Autentificare"]}
            selectedIndex={mode === "signup" ? 0 : 1}
            onChange={(event) => {
              setMode(event.nativeEvent.selectedSegmentIndex === 0 ? "signup" : "signin");
              setStep("email");
              setCode("");
            }}
          />
        )}

        {step === "success" ? (
          <Animated.View key="success" entering={FadeIn.duration(200)} style={{ alignItems: "center", paddingVertical: Space.lg }}>
            <RiveEmptyState
              type="check"
              title={mode === "signup" ? "Cont creat cu succes!" : "Conectat cu succes!"}
              message={
                mode === "signup"
                  ? "Bine ai venit în Medora. Preferințele tale sunt salvate."
                  : "Bun venit înapoi. Lista ta a fost sincronizată."
              }
            />
          </Animated.View>
        ) : step === "email" ? (
          <Animated.View key="email" entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} style={{ gap: Space.xl }}>
            <View style={{ gap: Space.sm }}>
              <ActionButton label="Continuă cu Apple" symbol="apple.logo" onPress={() => withProvider("apple")} />
              <ActionButton label="Continuă cu Google" variant="secondary" onPress={() => withProvider("google")} />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: Space.md }}>
              <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.separator }} />
              <Text style={{ ...Type.footnote, color: Colors.tertiaryLabel }}>sau cu email</Text>
              <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.separator }} />
            </View>

            <View style={{ gap: Space.lg }}>
              {mode === "signup" && (
                <Field
                  label="Nume complet"
                  placeholder="Dr. Andrei Popescu"
                  value={name}
                  onChangeText={setName}
                  textContentType="name"
                  autoComplete="name"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              )}
              <Field
                inputRef={emailRef}
                label="Email profesional"
                placeholder="medic@spital.ro"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
                onSubmitEditing={() => canSendCode && setStep("code")}
              />
            </View>

            <ActionButton label="Trimite codul" disabled={!canSendCode} onPress={() => setStep("code")} />
          </Animated.View>
        ) : (
          <Animated.View key="code" entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} style={{ gap: Space.xl }}>
            <Text style={{ ...Type.body, lineHeight: 24, color: Colors.label, textAlign: "center" }}>
              Am trimis un cod de 6 cifre la{"\n"}
              <Text style={{ fontWeight: "600" }}>{email.trim()}</Text>
            </Text>
            <Field
              label="Cod de verificare"
              placeholder="000000"
              value={code}
              onChangeText={(text) => setCode(text.replace(/\D/g, "").slice(0, 6))}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              autoFocus
              maxLength={6}
              style={{ fontSize: 28, letterSpacing: 10, textAlign: "center", fontVariant: ["tabular-nums"] }}
            />
            <ActionButton
              label="Confirmă"
              disabled={code.length !== 6}
              onPress={() =>
                finish({ name: name.trim() || nameFromEmail(email), email: email.trim(), provider: "email" })
              }
            />
            <ActionButton label="Schimbă emailul" variant="plain" onPress={() => setStep("email")} />
          </Animated.View>
        )}

        <Text style={{ ...Type.caption, lineHeight: 17, color: Colors.tertiaryLabel, textAlign: "center" }}>
          Continuând, accepți Termenii și Politica de confidențialitate Medora.
        </Text>
      </ScrollView>
    </>
  );
}
