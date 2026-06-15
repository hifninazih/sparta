import { create } from "zustand";
import { WisataCategory } from "@/lib/wisata-categories";

export interface WisataSearchResult {
  gid: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  address?: string;
  phone?: string;
  link?: string;
  maps_link?: string;
  lng: number;
  lat: number;
  desa?: string;
  kecamatan?: string;
  kabupaten?: string;
}

interface SearchState {
  keyword: string;
  // Multi-select kategori — array kosong = tidak difilter
  selectedCategories: WisataCategory[];
  results: WisataSearchResult[];
  isSearching: boolean;

  setKeyword: (keyword: string) => void;
  setSelectedCategories: (cats: WisataCategory[]) => void;
  setResults: (results: WisataSearchResult[]) => void;
  setIsSearching: (status: boolean) => void;

  executeSearch: (
    keyword: string,
    categories: WisataCategory[],
    bbox?: { minLng: number; minLat: number; maxLng: number; maxLat: number },
  ) => Promise<void>;
  clearSearch: () => void;
}

// Menyimpan AbortController aktif untuk membatalkan request in-flight jika ada pencarian baru
let activeAbortController: AbortController | null = null;

export const useSearchStore = create<SearchState>((set) => ({
  keyword: "",
  selectedCategories: [],
  results: [],
  isSearching: false,

  setKeyword: (keyword) => set({ keyword }),
  setSelectedCategories: (cats) => set({ selectedCategories: cats }),
  setResults: (results) => set({ results }),
  setIsSearching: (status) => set({ isSearching: status }),

  executeSearch: async (keyword, categories, bbox) => {
    // Batalkan request sebelumnya jika masih berjalan
    if (activeAbortController) {
      activeAbortController.abort();
    }
    activeAbortController = new AbortController();
    const { signal } = activeAbortController;

    set({ isSearching: true, keyword, selectedCategories: categories });

    try {
      const params = new URLSearchParams();
      if (keyword) params.append("s", keyword);

      categories.forEach((cat) => {
        params.append("c", cat);
      });

      if (bbox) {
        params.append("minLng", bbox.minLng.toString());
        params.append("minLat", bbox.minLat.toString());
        params.append("maxLng", bbox.maxLng.toString());
        params.append("maxLat", bbox.maxLat.toString());
      }

      const response = await fetch(`/api/wisata?${params.toString()}`, { signal });
      const data: WisataSearchResult[] = await response.json();

      set({ results: data, isSearching: false });
    } catch (error: any) {
      if (error.name === "AbortError") {
        // Abaikan error pembatalan
        return;
      }
      console.error("Gagal mencari wisata", error);
      set({ isSearching: false });
    }
  },

  clearSearch: () =>
    set({ keyword: "", selectedCategories: [], results: [] }),
}));

