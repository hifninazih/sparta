import { create } from "zustand";

interface SpartaState {
  bobot: { rating: number; fasilitas: number; harga: number; jarak: number };
  userLocation: [number, number] | null;
  isLoading: boolean;
  geojsonData: any | null; // Hasil kalkulasi rute & SAW
  selectedWisata: any | null; // Untuk data Popup

  setBobot: (kriteria: keyof SpartaState["bobot"], value: number) => void;
  setUserLocation: (lng: number, lat: number) => void;
  setIsLoading: (status: boolean) => void;
  setGeojsonData: (data: any) => void;
  setSelectedWisata: (data: any) => void;
}

export const useSpartaStore = create<SpartaState>((set) => ({
  bobot: { rating: 25, fasilitas: 25, harga: 25, jarak: 25 },
  userLocation: null,
  isLoading: false,
  geojsonData: null,
  selectedWisata: null,

  setBobot: (kriteria, value) =>
    set((state) => ({ bobot: { ...state.bobot, [kriteria]: value } })),
  setUserLocation: (lng, lat) => set({ userLocation: [lng, lat] }),
  setIsLoading: (status) => set({ isLoading: status }),
  setGeojsonData: (data) => set({ geojsonData: data }),
  setSelectedWisata: (data) => set({ selectedWisata: data }),
}));
