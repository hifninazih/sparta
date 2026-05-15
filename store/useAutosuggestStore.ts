import { create } from "zustand";
import { UnifiedSearchResult } from "@/app/api/search/route";

interface AutosuggestState {
  query: string;
  results: UnifiedSearchResult[];
  isSearching: boolean;

  setQuery: (query: string) => void;
  clearResults: () => void;
  fetchSuggestions: (query: string) => Promise<void>;
}

export const useAutosuggestStore = create<AutosuggestState>((set) => ({
  query: "",
  results: [],
  isSearching: false,

  setQuery: (query) => set({ query }),
  clearResults: () => set({ results: [], query: "" }),

  fetchSuggestions: async (query) => {
    if (!query.trim()) {
      set({ results: [], isSearching: false });
      return;
    }

    set({ isSearching: true });
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      set({ results: json.data || [], isSearching: false });
    } catch (error) {
      console.error("Gagal mengambil suggest", error);
      set({ isSearching: false });
    }
  },
}));
