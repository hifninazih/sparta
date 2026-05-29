import { create } from "zustand";

export interface WisataSearchResult {
  id: string;
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
  showSearchAreaBtn: boolean;

  setKeyword: (keyword: string) => void;
  setCategory: (category: string) => void;
  setResults: (results: WisataSearchResult[]) => void;
  setIsSearching: (status: boolean) => void;
  setShowSearchAreaBtn: (status: boolean) => void;

  executeSearch: (
    keyword: string,
    category: string,
    bbox?: { minLng: number; minLat: number; maxLng: number; maxLat: number },
  ) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  keyword: "",
  category: "Semua",
  results: [],
  isSearching: false,
  showSearchAreaBtn: false,

  setKeyword: (keyword) => set({ keyword }),
  setCategory: (category) => set({ category }),
  setResults: (results) => set({ results }),
  setIsSearching: (status) => set({ isSearching: status }),
  setShowSearchAreaBtn: (status) => set({ showSearchAreaBtn: status }),

  executeSearch: async (keyword, category, bbox) => {
    // 1. Set isSearching ke true, TAPI JANGAN ubah/hapus 'results'.
    // Ini yang membuat marker lama tetap nongkrong di peta selama API loading.
    set({ isSearching: true });

    try {
      const params = new URLSearchParams();
      if (keyword) params.append("s", keyword);
      if (category !== "Semua") params.append("c", category);

      if (bbox) {
        params.append("minLng", bbox.minLng.toString());
        params.append("minLat", bbox.minLat.toString());
        params.append("maxLng", bbox.maxLng.toString());
        params.append("maxLat", bbox.maxLat.toString());
      }

      const response = await fetch(`/api/wisata?${params.toString()}`);
      const data: WisataSearchResult[] = await response.json();

      // 2. TIMPA (Overwrite) data lama dengan data yang baru saja datang
      set({ results: data, isSearching: false });
    } catch (error) {
      console.error("Gagal mencari wisata", error);
      // Tetap kembalikan state loading ke false jika gagal
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ keyword: "", category: "Semua", results: [] }),
}));
