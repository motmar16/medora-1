import { useEffect, useState } from "react";

import { useAlertPrefs } from "@/store/alert-prefs";
import { useSession } from "@/store/session";
import { useWatchlist } from "@/store/watchlist";

const stores = [useSession, useWatchlist, useAlertPrefs];

function allHydrated() {
  return stores.every((store) => store.persist.hasHydrated());
}

// True once persisted state is read back, so the splash can hold until the
// app knows whether to show Welcome or the tabs (no flash of the wrong screen).
export function useStoresHydrated() {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    const check = () => setHydrated(allHydrated());
    const unsubscribe = stores.map((store) => store.persist.onFinishHydration(check));
    check();
    return () => unsubscribe.forEach((fn) => fn());
  }, []);

  return hydrated;
}
