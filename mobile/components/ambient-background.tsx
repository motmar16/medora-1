import { useColorScheme } from "react-native";

// The web landing's iridescent glow (theme.css --theme-glow), kept as a brand surface
// for the welcome screen only. Static on purpose: no looping motion.
const LIGHT = [
  "radial-gradient(circle at 18% 14%, rgba(244, 182, 218, 0.55) 0%, transparent 46%)",
  "radial-gradient(circle at 86% 20%, rgba(165, 214, 255, 0.55) 0%, transparent 44%)",
  "radial-gradient(circle at 50% 46%, rgba(224, 195, 252, 0.45) 0%, transparent 50%)",
  "radial-gradient(circle at 16% 76%, rgba(254, 238, 175, 0.38) 0%, transparent 42%)",
  "radial-gradient(circle at 84% 80%, rgba(187, 247, 208, 0.38) 0%, transparent 44%)",
].join(", ");

const DARK = [
  "radial-gradient(circle at 18% 14%, rgba(242, 168, 207, 0.20) 0%, transparent 46%)",
  "radial-gradient(circle at 86% 20%, rgba(120, 170, 230, 0.18) 0%, transparent 44%)",
  "radial-gradient(circle at 50% 46%, rgba(149, 103, 191, 0.22) 0%, transparent 50%)",
  "radial-gradient(circle at 84% 80%, rgba(120, 200, 160, 0.12) 0%, transparent 44%)",
].join(", ");

// Applied to the screen container itself (not a child layer) so the ScrollView stays the
// screen's first descendant and native scroll-edge settings keep working.
export function useAmbientBackground() {
  const dark = useColorScheme() === "dark";
  return {
    flex: 1,
    backgroundColor: dark ? "#050505" : "#FBFAF7",
    experimental_backgroundImage: dark ? DARK : LIGHT,
  } as const;
}
