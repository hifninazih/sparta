import { create } from "zustand";

interface WizardState {
  isOpen: boolean;
  step: number;

  // Nilai preferensi (0 - 100)
  jarak: number;
  harga: number;
  fasilitas: number;

  // Actions
  setIsOpen: (open: boolean) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPreference: (key: "jarak" | "harga" | "fasilitas", value: number) => void;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  isOpen: false,
  step: 1, // Dimulai dari langkah 1

  // Nilai default diletakkan di tengah (50)
  jarak: 50,
  harga: 50,
  fasilitas: 50,

  setIsOpen: (open) => set({ isOpen: open }),
  setStep: (step) => set({ step }),

  // Fungsi navigasi yang aman agar tidak melewati batas
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  // Mengubah nilai slider spesifik secara dinamis
  setPreference: (key, value) => set({ [key]: value }),

  resetWizard: () => set({ step: 1, jarak: 50, harga: 50, fasilitas: 50 }),
}));
