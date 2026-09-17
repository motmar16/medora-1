import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Medicine } from "@/constants/medicines";
import { persistentStorage } from "@/store/storage";

export type AlertEventType = Extract<Medicine["status"], "temporary" | "permanent" | "resumed">;
export type AlertFrequency = "instant" | "daily" | "weekly";

type AlertPrefsState = {
  events: Record<AlertEventType, boolean>;
  frequency: AlertFrequency;
  setEvent: (type: AlertEventType, enabled: boolean) => void;
  setFrequency: (frequency: AlertFrequency) => void;
};

// Same defaults as the web app (medora-prefs). Delivery is not wired yet: these only filter previews.
export const useAlertPrefs = create<AlertPrefsState>()(
  persist(
    (set) => ({
      events: { temporary: true, permanent: true, resumed: true },
      frequency: "daily",
      setEvent: (type, enabled) => set((state) => ({ events: { ...state.events, [type]: enabled } })),
      setFrequency: (frequency) => set({ frequency }),
    }),
    { name: "medora.alert-prefs", storage: persistentStorage }
  )
);
