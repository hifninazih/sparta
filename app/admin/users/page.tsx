"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/core/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/core/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/select";
import { Button } from "@/components/core/button"; 
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { 
  Users, 
  UserPlus, 
  Pencil, 
  Trash2, 
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAdminStore } from "@/store/useAdminStore";
import { PageHeader } from "@/components/admin/PageHeader";
import { SearchSection } from "@/components/admin/SearchSection";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { FormField } from "@/components/core/form-field";

interface User {
  id: string;
  username: string;
  full_name: string;
  role: "admin" | "superadmin";
  created_at: string;
}

export default function UserManagementPage() {
  // ... state logic
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
    role: "admin" as "admin" | "superadmin",
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

  const handleDeleteUser = async (id: string) => {
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
      <PageHeader 
        title="Manajemen User" 
        description="Kelola akun admin dan hak akses sistem SPARTA."
        icon={<Users className="h-8 w-8 text-purple-600" />}
      >
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
              <FormField id="username" label="Username">
                <Input 
                  id="username" 
                  placeholder="admin_wisata" 
                  required 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </FormField>
              <FormField id="full_name" label="Nama Lengkap">
                <Input 
                  id="full_name" 
                  placeholder="Budi Santoso" 
                  required 
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </FormField>
              <FormField id="password" label="Password">
                <Input 
                  id="password" 
                  type="password" 
                  autoComplete="new-password"
                  required 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </FormField>
              <FormField id="role" label="Role">
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
              </FormField>
              <DialogFooter className="pt-4">
                <Button variant="gradient" className="w-full font-bold" disabled={isSubmitLoading}>
                  {isSubmitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Akun"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <SearchSection 
        placeholder="Cari username atau nama..."
        value={searchQuery}
        onChange={setSearchQuery}
        onRefresh={() => fetchUsers(true)}
        isLoading={isLoading}
      />

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
                <TableCell className="text-right">
                  <ActionButtons 
                    onEdit={() => {
                      setSelectedUser(user);
                      setFormData({
                        username: user.username,
                        full_name: user.full_name,
                        password: "",
                        role: user.role
                      });
                      setIsEditDialogOpen(true);
                    }}
                    onDelete={() => handleDeleteUser(user.id)}
                    isProtected={user.role === "superadmin"}
                    deleteTitle="Hapus Pengguna?"
                    deleteDescription={`Apakah Anda yakin ingin menghapus ${user.full_name}? Tindakan ini tidak dapat dibatalkan.`}
                  />
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
            <FormField id="edit_username" label="Username">
              <Input 
                id="edit_username" 
                required 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </FormField>
            <FormField id="edit_full_name" label="Nama Lengkap">
              <Input 
                id="edit_full_name" 
                required 
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </FormField>
            <FormField id="edit_password" label="Password Baru (Opsional)" description="Isi jika ingin ganti password">
              <Input 
                id="edit_password" 
                type="password" 
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </FormField>
            <FormField id="edit_role" label="Role">
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
            </FormField>
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
