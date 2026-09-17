import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import type { SearchBarCommands } from "react-native-screens";

import { AccountAvatarButton } from "@/components/account-button";
import { EmptyState } from "@/components/empty-state";
import { FilterChips } from "@/components/filter-chips";
import { MedicineCard } from "@/components/medicine-card";
import { CATEGORIES, MEDICINES } from "@/constants/medicines";
import { Space } from "@/constants/theme";

export default function CatalogScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const searchBar = useRef<SearchBarCommands>(null);
  const [query, setQuery] = useState(params.q ?? "");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const deferredQuery = useDeferredValue(query);

  // A search started on Welcome arrives as ?q=; mirror it into the native search field.
  useEffect(() => {
    if (!params.q) return;
    setQuery(params.q);
    const timer = setTimeout(() => searchBar.current?.setText(params.q ?? ""), 250);
    return () => clearTimeout(timer);
  }, [params.q]);

  const results = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return MEDICINES.filter((m) => {
      const inCategory = category === CATEGORIES[0] || m.group === category;
      const matches =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.dci.toLowerCase().includes(q) ||
        m.atc.toLowerCase().includes(q);
      return inCategory && matches;
    });
  }, [deferredQuery, category]);

  return (
    <>
      <Stack.Screen
        options={{
          // Soft edge lets card titles ghost through the search field; hard keeps it legible.
          scrollEdgeEffects: { top: "hard" },
          headerSearchBarOptions: {
            ref: searchBar,
            placeholder: "Medicament, DCI sau cod ATC",
            autoCapitalize: "none",
            hideWhenScrolling: false,
            // Keep search under the large title; toolbar integration puts it behind the tab bar.
            placement: "stacked",
            onChangeText: (event) => setQuery(event.nativeEvent.text),
          },
        }}
      />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="info.circle"
          accessibilityLabel="Despre Medora"
          onPress={() => router.push("/about")}
        />
        <Stack.Toolbar.View>
          <AccountAvatarButton />
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <FlashList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MedicineCard medicine={item} />}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ padding: Space.lg }}
        ItemSeparatorComponent={() => <View style={{ height: Space.md }} />}
        ListHeaderComponent={
          <View style={{ paddingBottom: Space.lg }}>
            <FilterChips options={CATEGORIES} selected={category} onSelect={setCategory} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            symbol="magnifyingglass"
            title="Niciun rezultat"
            message="Caută după denumirea comercială, substanța activă sau codul ATC, ori alege altă categorie."
            action={
              category !== CATEGORIES[0]
                ? { label: "Arată toate", onPress: () => setCategory(CATEGORIES[0]) }
                : undefined
            }
          />
        }
      />
    </>
  );
}
