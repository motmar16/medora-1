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
  continueAsGuest: () => void;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  /** Development only: return to the first-launch Welcome screen. */
  resetOnboarding: () => void;
};

// Mock session: the screens are real, the provider calls are not wired yet.
// Replace signIn with Supabase/Clerk once the backend is chosen.
export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      user: null,
      continueAsGuest: () => set({ hasOnboarded: true }),
      signIn: (user) => set({ user, hasOnboarded: true }),
      signOut: () => set({ user: null }),
      resetOnboarding: () => set({ user: null, hasOnboarded: false }),
    }),
    { name: "medora.session", storage: persistentStorage }
  )
);
