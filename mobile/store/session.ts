import { create } from "zustand";
import { persist } from "zustand/middleware";

import { persistentStorage } from "@/store/storage";

export type AuthProvider = "apple" | "google" | "email";

export type SessionUser = {
  name: string;
  email: string;
  provider: AuthProvider;
};

type SessionState = {
  hasOnboarded: boolean;
  user: SessionUser | null;
  /** Where to land once Welcome is gone (a module or search tapped on Welcome). Not persisted. */
  pendingHref: string | null;
  continueAsGuest: (href?: string) => void;
  signIn: (user: SessionUser, href?: string) => void;
  /** Signing out (or leaving guest mode) returns to Welcome. Bookmarks stay on the device. */
  signOut: () => void;
  takePendingHref: () => string | null;
};

// Mock session: the screens are real, the provider calls are not wired yet.
// Replace signIn with Supabase/Clerk once the backend is chosen.
export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      user: null,
      pendingHref: null,
      continueAsGuest: (href) => set({ hasOnboarded: true, pendingHref: href ?? null }),
      signIn: (user, href) => set({ user, hasOnboarded: true, pendingHref: href ?? null }),
      signOut: () => set({ user: null, hasOnboarded: false, pendingHref: null }),
      takePendingHref: () => {
        const href = get().pendingHref;
        if (href) set({ pendingHref: null });
        return href;
      },
    }),
    {
      name: "medora.session",
      storage: persistentStorage,
      partialize: (state) => ({ hasOnboarded: state.hasOnboarded, user: state.user }),
    }
  )
);
