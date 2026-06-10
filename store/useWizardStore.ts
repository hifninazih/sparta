import { create } from "zustand";
import { WisataCategory } from "@/lib/wisata-categories";

interface WizardState {
  isOpen: boolean;
  step: number;
  isPickingLocation: boolean;

  // Bobot preferensi
  jarak: number;
  harga: number;
  reviews: number;
  rating: number;

  // Kategori yang dipilih — array kosong = semua kategori (tidak difilter)
  selectedCategories: WisataCategory[];

  setIsOpen: (open: boolean) => void;
  setStep: (step: number) => void;
  setIsPickingLocation: (val: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPreference: (key: "jarak" | "harga" | "reviews" | "rating", value: number) => void;
  setSelectedCategories: (cats: WisataCategory[]) => void;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  isOpen: false,
  step: 1,
  isPickingLocation: false,

  jarak: 50,
  harga: 50,
  reviews: 50,
  rating: 50,

  // Default: array kosong = semua kategori aktif
  selectedCategories: [],

  setIsOpen: (open) => set({ isOpen: open }),
  setStep: (step) => set({ step }),
  setIsPickingLocation: (val) => set({ isPickingLocation: val }),

  // 6 langkah wizard: 1 lokasi + 1 kategori + 4 slider
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 6) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setPreference: (key, value) => set({ [key]: value }),
  setSelectedCategories: (cats) => set({ selectedCategories: cats }),

  resetWizard: () =>
    set({
      step: 1,
      jarak: 50,
      harga: 50,
      reviews: 50,
      rating: 50,
      selectedCategories: [],
      isPickingLocation: false,
    }),
}));
