import { create } from "zustand";

interface User {
  id: string;
  username: string;
  full_name: string;
  role: "admin" | "superadmin";
  created_at: string;
}

interface Wisata {
  gid: number;
  name: string;
  category: string;
  sub_kategori: string;
  kategori_id: number;
  sub_kategori_id: number | null;
  price: number;
  rating: number;
  reviews: number;
  address: string;
  link: string;
  maps_link: string;
  username_instagram: string;
  daya_tarik_utama: string;
  daya_tarik_pendukung: string;
  lng: number;
  lat: number;
}

interface AdminState {
  users: User[];
  wisata: Wisata[];
  isUsersLoaded: boolean;
  isWisataLoaded: boolean;
  isLoading: boolean;
  
  setUsers: (users: User[]) => void;
  setWisata: (wisata: Wisata[]) => void;
  
  fetchUsers: (force?: boolean) => Promise<void>;
  fetchWisata: (force?: boolean) => Promise<void>;
  
  // Actions to mutate specific items without refetching everything
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (id: string) => void;
  
  addWisata: (wisata: Wisata) => void;
  updateWisata: (wisata: Wisata) => void;
  removeWisata: (gid: string) => void;

  clearStore: () => void; // Call this on logout
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  wisata: [],
  isUsersLoaded: false,
  isWisataLoaded: false,
  isLoading: false,

  setUsers: (users) => set({ users, isUsersLoaded: true }),
  setWisata: (wisata) => set({ wisata, isWisataLoaded: true }),

  fetchUsers: async (force = false) => {
    if (!force && get().isUsersLoaded) return;
    
    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        set({ users: data, isUsersLoaded: true });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWisata: async (force = false) => {
    if (!force && get().isWisataLoaded) return;
    
    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/wisata");
      const data = await res.json();
      if (res.ok) {
        set({ wisata: data, isWisataLoaded: true });
      }
    } catch (error) {
      console.error("Error fetching wisata:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
  updateUser: (user) => set((state) => ({
    users: state.users.map((u) => (u.id === user.id ? user : u))
  })),
  removeUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id)
  })),

  addWisata: (wisata) => set((state) => ({ wisata: [wisata, ...state.wisata] })),
  updateWisata: (wisata) => set((state) => ({
    wisata: state.wisata.map((w) => (w.gid === wisata.gid ? wisata : w))
  })),
  removeWisata: (gid) => set((state) => ({
    wisata: state.wisata.filter((w) => w.gid.toString() !== gid)
  })),

  clearStore: () => set({ users: [], wisata: [], isUsersLoaded: false, isWisataLoaded: false }),
}));
