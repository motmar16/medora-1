import { create } from "zustand";

type WatchlistState = {
  ids: string[];
  toggle: (id: string) => void;
};

// Single source of truth for bookmarks, shared by catalog, detail and "Lista mea".
export const useWatchlist = create<WatchlistState>((set) => ({
  ids: ["amoxi", "metfo", "rami", "levo"],
  toggle: (id) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((item) => item !== id)
        : [...state.ids, id],
    })),
}));
