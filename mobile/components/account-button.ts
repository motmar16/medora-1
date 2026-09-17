import { useRouter } from "expo-router";

import { useSession } from "@/store/session";

// Props for the account button every tab shows at the top right:
// spread onto <Stack.Toolbar.Button {...account} />.
export function useAccountButton() {
  const router = useRouter();
  const signedIn = useSession((state) => state.user !== null);

  return {
    icon: signedIn ? "person.crop.circle.fill" : "person.crop.circle",
    accessibilityLabel: signedIn ? "Contul meu" : "Cont",
    onPress: () => router.push("/account"),
  } as const;
}
