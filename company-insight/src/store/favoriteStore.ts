// src/store/favoriteStore.ts
import { create } from "zustand";

interface FavoriteState {
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  selectedIds: number[];
  toggleSelectedId: (id: number) => void;
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  selectedCompany: "",
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  selectedIds: [],
  toggleSelectedId: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    })),
}));
