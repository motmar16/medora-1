import * as SecureStore from "expo-secure-store";
import { createJSONStorage, type StateStorage } from "zustand/middleware";

// Small persisted state (session, bookmarks) lives in the Keychain via SecureStore.
const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const persistentStorage = createJSONStorage(() => secureStorage);
