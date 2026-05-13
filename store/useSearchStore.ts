import { create } from "zustand";

export interface WisataSearchResult {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  lng: number;
  lat: number;
}

interface SearchState {
  keyword: string;
  category: string;
  results: WisataSearchResult[];
  isSearching: boolean;

  setKeyword: (keyword: string) => void;
  setCategory: (category: string) => void;
  setResults: (results: WisataSearchResult[]) => void;
  setIsSearching: (status: boolean) => void;

  // Fungsi eksekusi pencarian ke API
  executeSearch: (
    keyword: string,
    category: string,
    bbox?: { minLng: number; minLat: number; maxLng: number; maxLat: number },
  ) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keyword: "",
  category: "Semua", // Default tanpa filter
  results: [],
  isSearching: false,

  setKeyword: (keyword) => set({ keyword }),
  setCategory: (category) => set({ category }),
  setResults: (results) => set({ results }),
  setIsSearching: (status) => set({ isSearching: status }),

  executeSearch: async (keyword, category, bbox) => {
    set({ isSearching: true });
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("s", keyword);
      if (category !== "Semua") params.append("c", category);

      // Jika BBOX dikirim (dari klik tombol "Telusuri area ini")
      if (bbox) {
        params.append("minLng", bbox.minLng.toString());
        params.append("minLat", bbox.minLat.toString());
        params.append("maxLng", bbox.maxLng.toString());
        params.append("maxLat", bbox.maxLat.toString());
      }

      const response = await fetch(`/api/wisata?${params.toString()}`);
      const data = await response.json();

      set({ results: data, isSearching: false });
    } catch (error) {
      console.error("Gagal mencari wisata", error);
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ keyword: "", category: "Semua", results: [] }),
}));
