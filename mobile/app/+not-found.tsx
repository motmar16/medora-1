import { Stack, useRouter } from "expo-router";
import { ScrollView } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { Colors } from "@/constants/theme";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: Colors.background }}>
      <Stack.Screen options={{ title: "Pagină inexistentă", headerShown: true }} />
      <EmptyState
        symbol="questionmark.folder"
        title="Pagina nu există"
        message="Linkul accesat nu corespunde niciunui ecran din Medora."
        action={{ label: "Deschide catalogul", onPress: () => router.replace("/(tabs)/(catalog)/catalog") }}
      />
    </ScrollView>
  );
}
