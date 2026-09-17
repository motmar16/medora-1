import { create } from "zustand";

export type CompareSlot = "A" | "B";

type CompareState = {
  A: string;
  B: string;
  pick: (slot: CompareSlot, id: string) => void;
  swap: () => void;
};

export const useCompare = create<CompareState>((set) => ({
  A: "amoxi",
  B: "amoxi2",
  pick: (slot, id) => set({ [slot]: id } as Pick<CompareState, CompareSlot>),
  swap: () => set((state) => ({ A: state.B, B: state.A })),
}));
