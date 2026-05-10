import { create } from "zustand";

interface WizardState {
  isOpen: boolean;
  step: number;
  isPickingLocation: boolean; // TAMBAHAN: Status mode pilih di peta

  jarak: number;
  harga: number;
  fasilitas: number;

  setIsOpen: (open: boolean) => void;
  setStep: (step: number) => void;
  setIsPickingLocation: (val: boolean) => void; // TAMBAHAN: Aksi
  nextStep: () => void;
  prevStep: () => void;
  setPreference: (key: "jarak" | "harga" | "fasilitas", value: number) => void;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  isOpen: false,
  step: 1,
  isPickingLocation: false, // Default false

  jarak: 50,
  harga: 50,
  fasilitas: 50,

  setIsOpen: (open) => set({ isOpen: open }),
  setStep: (step) => set({ step }),
  setIsPickingLocation: (val) => set({ isPickingLocation: val }),

  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setPreference: (key, value) => set({ [key]: value }),

  resetWizard: () =>
    set({
      step: 1,
      jarak: 50,
      harga: 50,
      fasilitas: 50,
      isPickingLocation: false,
    }),
}));
