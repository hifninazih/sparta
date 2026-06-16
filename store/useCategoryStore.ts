import { create } from "zustand";

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getCategoryColor: (name: string) => string;
  getCategoryIcon: (name: string) => string;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();
      if (result.success) {
        set({ categories: result.data });
      } else {
        set({ error: result.message });
      }
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
  getCategoryColor: (name: string) => {
    const { categories } = get();
    const category = categories.find((c) => c.name === name);
    return category?.color || "#FF8038";
  },
  getCategoryIcon: (name: string) => {
    const { categories } = get();
    const category = categories.find((c) => c.name === name);
    return category?.icon || "MapPin";
  },
}));
