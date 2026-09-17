import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router/stack";

import { Colors } from "@/constants/theme";

const TITLES = {
  index: "Medicamente",
  radar: "Radar alerte",
  compare: "Comparator",
  watch: "Lista mea",
} as const;

// One native stack per tab; every tab can push the shared medicine detail.
export default function TabStackLayout({ segment }: { segment: string }) {
  const screen = segment.match(/\((.*)\)/)?.[1] as keyof typeof TITLES;

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: "transparent" },
        headerLargeTitleEnabled: true,
        // iOS 26+ draws the scroll-edge glass itself; older iOS needs a material behind the bar.
        headerBlurEffect: isLiquidGlassAvailable() ? "none" : "systemChromeMaterial",
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: Colors.accent,
        // Tint is for bar buttons only; titles stay in the label color.
        headerTitleStyle: { color: Colors.label },
        headerLargeTitleStyle: { color: Colors.label },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name={screen} options={{ title: TITLES[screen] }} />
      <Stack.Screen name="medicine/[id]" />
    </Stack>
  );
}
