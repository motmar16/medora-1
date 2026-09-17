import type { ImageSourcePropType } from "react-native";

export type AppModule = {
  key: string;
  label: string;
  icon: ImageSourcePropType;
  /** Explicit tab group, so shared routes never open inside the wrong tab. */
  href: string | null;
};

// Same modules and 3D spot icons as the web landing grid (index.html).
export const MODULES: AppModule[] = [
  { key: "medicine", label: "Medicamente", icon: require("@/assets/images/modules/medicine.png"), href: "/(tabs)/(index)" },
  { key: "radar", label: "Radar", icon: require("@/assets/images/modules/radar.png"), href: "/(tabs)/(radar)/radar" },
  { key: "compare", label: "Compară", icon: require("@/assets/images/modules/compare.png"), href: "/(tabs)/(compare)/compare" },
  { key: "watch", label: "Lista mea", icon: require("@/assets/images/modules/watchlist.png"), href: "/(tabs)/(watch)/watch" },
  { key: "tools", label: "Instrumente", icon: require("@/assets/images/modules/tools.png"), href: null },
  { key: "atc", label: "ATC", icon: require("@/assets/images/modules/atc.png"), href: "/(tabs)/(index)?q=J01" },
];

export const FREQUENT_SEARCHES = ["Amoxicilină", "Metformină", "J01CA04"];

export function catalogHref(query: string) {
  const q = query.trim();
  return q ? `/(tabs)/(index)?q=${encodeURIComponent(q)}` : "/(tabs)/(index)";
}
