import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router/stack";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";
import { useStoresHydrated } from "@/store/hydration";
import { useSession } from "@/store/session";

export { ErrorBoundary } from "expo-router";

// Hold the splash until the persisted session is read, so Welcome never flashes before the tabs.
SplashScreen.preventAutoHideAsync();

// Sheets use a transparent content background so iOS 26+ renders them as Liquid Glass.
const sheet = {
  presentation: "formSheet" as const,
  sheetGrabberVisible: true,
  sheetAllowedDetents: [0.6, 1.0],
  contentStyle: { backgroundColor: "transparent" },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hydrated = useStoresHydrated();
  const hasOnboarded = useSession((state) => state.hasOnboarded);

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync().catch(() => {});
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* One-way door: once past Welcome, back can never return to it. */}
        <Stack.Protected guard={hasOnboarded}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!hasOnboarded}>
          <Stack.Screen
            name="welcome"
            options={{ animation: "fade", scrollEdgeEffects: { top: "hidden", bottom: "hidden" } }}
          />
        </Stack.Protected>

        {/* Self-contained multi-step task: a modal with its own header and close button. */}
        <Stack.Screen
          name="sign-in"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTransparent: true,
            contentStyle: { backgroundColor: Colors.background },
          }}
        />
        {/* Taller first detent so the ANMDMR button isn't cut off. */}
        <Stack.Screen name="about" options={{ ...sheet, sheetAllowedDetents: [0.72, 1.0] }} />
        <Stack.Screen name="account" options={{ ...sheet, sheetAllowedDetents: [0.62, 1.0] }} />
        <Stack.Screen name="pick-medicine" options={sheet} />
      </Stack>
    </ThemeProvider>
  );
}
