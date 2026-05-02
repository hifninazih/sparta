import { create } from "zustand";

// Kita definisikan tipe datanya (karena kita pakai TypeScript)
interface SpartaState {
  bobot: {
    rating: number;
    fasilitas: number;
    harga: number;
    ulasan: number;
  };
  // Fungsi untuk mengubah nilai salah satu kriteria
  setBobot: (kriteria: keyof SpartaState["bobot"], value: number) => void;
}

export const useSpartaStore = create<SpartaState>((set) => ({
  // Nilai awal (Default State)
  bobot: {
    rating: 30,
    fasilitas: 30,
    harga: 20,
    ulasan: 20,
  },

  // Aksi untuk memperbarui nilai bobot
  setBobot: (kriteria, value) =>
    set((state) => ({
      bobot: {
        ...state.bobot,
        [kriteria]: value,
      },
    })),
}));
