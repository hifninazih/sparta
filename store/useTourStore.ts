import { create } from "zustand";

interface TourState {
  run: boolean;
  stepIndex: number;
  setRun: (run: boolean) => void;
  setStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useTourStore = create<TourState>((set) => ({
  run: false,
  stepIndex: 0,
  setRun: (run) => set({ run }),
  setStepIndex: (index) => set({ stepIndex: index }),
  nextStep: () => set((state) => ({ stepIndex: state.stepIndex + 1 })),
  prevStep: () => set((state) => ({ stepIndex: Math.max(0, state.stepIndex - 1) })),
}));
