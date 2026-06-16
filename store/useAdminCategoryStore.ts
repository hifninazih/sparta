import { create } from "zustand";

export interface AdminCategory {
  id: number;
  name: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

interface AdminCategoryState {
  categories: AdminCategory[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: (search?: string) => Promise<void>;
  addCategory: (data: Partial<AdminCategory>) => Promise<AdminCategory>;
  updateCategory: (id: number, data: Partial<AdminCategory>) => Promise<AdminCategory>;
  removeCategory: (id: number) => Promise<void>;
}

export const useAdminCategoryStore = create<AdminCategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async (search = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/admin/categories?search=${encodeURIComponent(search)}`);
      if (!response.ok) throw new Error("Gagal mengambil data kategori");
      const data = await response.json();
      set({ categories: data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (data) => {
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Gagal menambah kategori");
    }
    
    const newCategory = await response.json();
    set(state => ({ categories: [newCategory, ...state.categories] }));
    return newCategory;
  },

  updateCategory: async (id, data) => {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Gagal memperbarui kategori");
    }
    
    const updatedCategory = await response.json();
    set(state => ({
      categories: state.categories.map(c => c.id === id ? updatedCategory : c)
    }));
    return updatedCategory;
  },

  removeCategory: async (id) => {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Gagal menghapus kategori");
    }
    
    set(state => ({
      categories: state.categories.filter(c => c.id !== id)
    }));
  },
}));
