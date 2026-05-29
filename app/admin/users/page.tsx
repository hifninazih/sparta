"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/dialog-neo";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/button"; 
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { 
  Users, 
  UserPlus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Search,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

import { useAdminStore } from "@/store/useAdminStore";

interface User {
  id: number;
  username: string;
  full_name: string;
  role: "admin" | "superadmin";
  created_at: string;
}

export default function UserManagementPage() {
  const { 
    users, 
    isUsersLoaded, 
    isLoading,
    fetchUsers,
    addUser, 
    updateUser, 
    removeUser 
  } = useAdminStore();
  
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    password: "",
    role: "admin" as const,
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User berhasil ditambahkan");
        setIsAddDialogOpen(false);
        setFormData({ username: "", full_name: "", password: "", role: "admin" });
        addUser(data); // Optimistic update via Zustand
      } else {
        toast.error(data.message || "Gagal menambah user");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User berhasil diperbarui");
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        updateUser(data); // Optimistic update via Zustand
      } else {
        toast.error(data.message || "Gagal memperbarui user");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User berhasil dihapus");
        removeUser(id); // Optimistic update via Zustand
      } else {
        const data = await res.json();
        toast.error(data.message || "Gagal menghapus user");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    }
  };


  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-600" /> Manajemen User
          </h1>
          <p className="text-slate-500">Kelola akun admin dan hak akses sistem SPARTA.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" size="lg" className="font-bold" startIcon={<UserPlus />}>
              Tambah Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Admin Baru</DialogTitle>
              <DialogDescription>
                Lengkapi data di bawah untuk membuat akun admin baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="admin_wisata" 
                  required 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input 
                  id="full_name" 
                  placeholder="Budi Santoso" 
                  required 
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(v: any) => setFormData({...formData, role: v})}
                >
                  <SelectTrigger className="border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:ring-0">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="gradient" className="w-full font-bold" disabled={isSubmitLoading}>
                  {isSubmitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Akun"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4 border-2 border-black rounded-xl bg-[#f8fafc] flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Cari username atau nama..." 
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="rect" onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Nama Lengkap</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Tgl Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex justify-center items-center gap-2 text-slate-500 font-bold">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" /> Memuat data...
                </div>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500 font-bold">
                Tidak ada user ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{user.username}</TableCell>
                <TableCell className="font-bold text-slate-800">{user.full_name}</TableCell>
                <TableCell>
                  <div className={user.role === "superadmin" ? "bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-300 text-[10px] font-black uppercase w-fit" : "bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-300 text-[10px] font-black uppercase w-fit"}>
                    {user.role}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-xs font-bold">
                  {new Date(user.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <button 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData({
                        username: user.username,
                        full_name: user.full_name,
                        password: "",
                        role: user.role
                      });
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Edit Akun Admin</DialogTitle>
            <DialogDescription>
              Ubah data akun untuk {selectedUser?.username}. Kosongkan password jika tidak ingin mengganti.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit_username">Username</Label>
              <Input 
                id="edit_username" 
                required 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_full_name">Nama Lengkap</Label>
              <Input 
                id="edit_full_name" 
                required 
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_password">Password Baru (Opsional)</Label>
              <Input 
                id="edit_password" 
                type="password" 
                placeholder="Isi jika ingin ganti password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(v: any) => setFormData({...formData, role: v})}
              >
                <SelectTrigger className="border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:ring-0">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="primary" className="w-full font-bold" disabled={isSubmitLoading}>
                {isSubmitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Perbarui Akun"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
