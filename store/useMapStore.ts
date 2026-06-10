// useMapStore.ts
import { create } from "zustand";
import type { ViewState } from "@vis.gl/react-maplibre";

interface MapState {
  viewState: ViewState;

  minZoom: number;
  maxZoom: number;

  // 1. Lokasi GPS Asli (Titik Biru)
  userLocation: [number, number] | null;
  setUserLocation: (loc: [number, number] | null) => void;

  // 2. Lokasi Acuan Wisata (Titik Merah hasil Wizard)
  selectedLocation: [number, number] | null;
  setSelectedLocation: (loc: [number, number] | null) => void;

  setViewState: (viewState: ViewState) => void;
  isSatellite: boolean;
  toggleMapStyle: () => void;

  activeWisata: any | null;
  setActiveWisata: (wisata: any | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  viewState: {
    longitude: 110.3695,
    latitude: -7.7956,
    zoom: 10,
    pitch: 0,
    bearing: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
  minZoom: 5,
  maxZoom: 20,

  userLocation: null,
  setUserLocation: (loc) => set({ userLocation: loc }),

  selectedLocation: null,
  setSelectedLocation: (loc) => set({ selectedLocation: loc }),

  setViewState: (newViewState) => set({ viewState: newViewState }),
  isSatellite: false,
  toggleMapStyle: () => set((state) => ({ isSatellite: !state.isSatellite })),

  activeWisata: null,
  setActiveWisata: (wisata) => set({ activeWisata: wisata }),
}));
