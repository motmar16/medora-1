import { Image } from "react-native";

// The pink asterisk tile from the web header and the app icon.
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      source={require("@/assets/images/splash-icon.png")}
      style={{ width: size, height: size }}
      accessibilityIgnoresInvertColors
      accessibilityElementsHidden
    />
  );
}
