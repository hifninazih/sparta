import { create } from "zustand";

export interface WisataRecommendation {
  id: number;
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
  activeWisataId: number | null; // Untuk efek highlight saat di-hover

  setRecommendations: (data: WisataRecommendation[]) => void;
  setIsLoading: (loading: boolean) => void;
  setActiveWisataId: (id: number | null) => void;
  clearRecommendations: () => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],
  isLoading: false,
  activeWisataId: null,

  setRecommendations: (data) => set({ recommendations: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setActiveWisataId: (id) => set({ activeWisataId: id }),
  clearRecommendations: () =>
    set({ recommendations: [], activeWisataId: null }),
}));
