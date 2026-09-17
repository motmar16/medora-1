import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { Stack } from "expo-router/stack";
import { useColorScheme } from "react-native";

export { ErrorBoundary } from "expo-router";

// Sheets use a transparent content background so iOS 26+ renders them as Liquid Glass.
const sheet = {
  presentation: "formSheet" as const,
  sheetGrabberVisible: true,
  sheetAllowedDetents: [0.6, 1.0],
  contentStyle: { backgroundColor: "transparent" },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/* Taller first detent so the ANMDMR button isn't cut off. */}
        <Stack.Screen name="about" options={{ ...sheet, sheetAllowedDetents: [0.72, 1.0] }} />
        <Stack.Screen name="pick-medicine" options={sheet} />
      </Stack>
    </ThemeProvider>
  );
}
