import { create } from "zustand";

export interface WisataRecommendation {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  all_facility: string;
  lng: number;
  lat: number;
  distance_m: number;
  score: number; // Nilai akhir dari SAW
}

interface RecommendationState {
  recommendations: WisataRecommendation[];
  isLoading: boolean;
  activeWisataId: string | null; // Untuk efek highlight saat di-hover
  mobileSnap: number | string | null; // Track posisi drawer mobile

  setRecommendations: (data: WisataRecommendation[]) => void;
  setIsLoading: (loading: boolean) => void;
  setActiveWisataId: (id: string | null) => void;
  setMobileSnap: (snap: number | string | null) => void;
  clearRecommendations: () => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],
  isLoading: false,
  activeWisataId: null,
  mobileSnap: 0.6, // Default snap point tengah

  setRecommendations: (data) => set({ recommendations: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setActiveWisataId: (id) => set({ activeWisataId: id }),
  setMobileSnap: (snap) => set({ mobileSnap: snap }),
  clearRecommendations: () =>
    set({ recommendations: [], activeWisataId: null }),
}));
