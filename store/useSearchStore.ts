import { create } from "zustand";
import { WisataCategory } from "@/lib/wisata-categories";

export interface WisataSearchResult {
  gid: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  lng: number;
  lat: number;
}

interface SearchState {
  keyword: string;
  // Multi-select kategori — array kosong = "Semua" (tidak difilter)
  selectedCategories: WisataCategory[];
  results: WisataSearchResult[];
  isSearching: boolean;
  showSearchAreaBtn: boolean;

  setKeyword: (keyword: string) => void;
  setSelectedCategories: (cats: WisataCategory[]) => void;
  setResults: (results: WisataSearchResult[]) => void;
  setIsSearching: (status: boolean) => void;
  setShowSearchAreaBtn: (status: boolean) => void;

  executeSearch: (
    keyword: string,
    categories: WisataCategory[],
    bbox?: { minLng: number; minLat: number; maxLng: number; maxLat: number },
  ) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keyword: "",
  selectedCategories: [], // kosong = semua
  results: [],
  isSearching: false,
  showSearchAreaBtn: false,

  setKeyword: (keyword) => set({ keyword }),
  setSelectedCategories: (cats) => set({ selectedCategories: cats }),
  setResults: (results) => set({ results }),
  setIsSearching: (status) => set({ isSearching: status }),
  setShowSearchAreaBtn: (status) => set({ showSearchAreaBtn: status }),

  executeSearch: async (keyword, categories, bbox) => {
    set({ isSearching: true, keyword, selectedCategories: categories });

    try {
      const params = new URLSearchParams();
      if (keyword) params.append("s", keyword);

      // Kirim setiap kategori sebagai param "c" yang diulang
      // (kecuali kosong = Semua)
      categories.forEach((cat) => {
        if (cat !== "Semua") params.append("c", cat);
      });

      if (bbox) {
        params.append("minLng", bbox.minLng.toString());
        params.append("minLat", bbox.minLat.toString());
        params.append("maxLng", bbox.maxLng.toString());
        params.append("maxLat", bbox.maxLat.toString());
      }

      const response = await fetch(`/api/wisata?${params.toString()}`);
      const data: WisataSearchResult[] = await response.json();

      set({ results: data, isSearching: false });
    } catch (error) {
      console.error("Gagal mencari wisata", error);
      set({ isSearching: false });
    }
  },

  clearSearch: () =>
    set({ keyword: "", selectedCategories: [], results: [], showSearchAreaBtn: false }),
}));
