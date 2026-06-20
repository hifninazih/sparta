import { create } from "zustand";

export interface AdminSubCategory {
  id: number;
  name: string;
  is_active: boolean;
}

export interface AdminCategory {
  id: number;
  name: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  sub_categories?: AdminSubCategory[];
}

interface AdminCategoryState {
  categories: AdminCategory[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: (search?: string) => Promise<void>;
  addCategory: (data: Partial<AdminCategory>) => Promise<AdminCategory>;
  updateCategory: (id: number, data: Partial<AdminCategory>) => Promise<AdminCategory>;
  removeCategory: (id: number) => Promise<void>;
  addSubCategory: (kategori_id: number, data: Partial<AdminSubCategory>) => Promise<AdminSubCategory>;
  updateSubCategory: (id: number, data: Partial<AdminSubCategory>, kategori_id: number) => Promise<AdminSubCategory>;
  removeSubCategory: (id: number, kategori_id: number) => Promise<void>;
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

  addSubCategory: async (kategori_id, data) => {
    const response = await fetch("/api/admin/sub_categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, kategori_id }),
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Gagal menambah sub kategori");
    }
    
    const newSubCategory = await response.json();
    set(state => ({
      categories: state.categories.map(c => {
        if (c.id === kategori_id) {
          return { ...c, sub_categories: [...(c.sub_categories || []), newSubCategory] };
        }
        return c;
      })
    }));
    return newSubCategory;
  },

  updateSubCategory: async (id, data, kategori_id) => {
    const response = await fetch(`/api/admin/sub_categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Gagal memperbarui sub kategori");
    }
    
    const updatedSubCategory = await response.json();
    set(state => ({
      categories: state.categories.map(c => {
        if (c.id === kategori_id) {
          return {
            ...c,
            sub_categories: c.sub_categories?.map(sc => sc.id === id ? updatedSubCategory : sc) || []
          };
        }
        return c;
      })
    }));
    return updatedSubCategory;
  },

  removeSubCategory: async (id, kategori_id) => {
    const response = await fetch(`/api/admin/sub_categories/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Gagal menghapus sub kategori");
    }
    
    set(state => ({
      categories: state.categories.map(c => {
        if (c.id === kategori_id) {
          return {
            ...c,
            sub_categories: c.sub_categories?.filter(sc => sc.id !== id) || []
          };
        }
        return c;
      })
    }));
  },
}));
