"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import { User, Shield, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { NeoCard } from "@/components/admin/NeoCard";

export default function AdminProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData((prev) => ({
            ...prev,
            username: data.username || "",
            full_name: data.full_name || "",
          }));
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Manual via Toast
    if (!formData.full_name.trim()) {
      toast.error("Nama Lengkap tidak boleh kosong.");
      return;
    }
    if (!formData.username.trim()) {
      toast.error("Username tidak boleh kosong.");
      return;
    }
    if (!formData.currentPassword) {
      toast.error("Silakan masukkan password saat ini untuk memverifikasi perubahan.");
      return;
    }

    if (isChangingPassword) {
      if (!formData.password) {
        toast.error("Password baru tidak boleh kosong.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Konfirmasi password tidak cocok.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          full_name: formData.full_name,
          currentPassword: formData.currentPassword,
          password: isChangingPassword ? formData.password : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profil berhasil diperbarui!");
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          password: "",
          confirmPassword: "",
        }));
        setIsChangePassword(false);
        // Segarkan halaman untuk sinkronisasi sidebar
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(data.message || "Gagal memperbarui profil.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 bg-[#f8fafc] min-h-screen">
      <PageHeader 
        title="Profil Saya" 
        description="Kelola informasi akun dan hak akses sistem SPARTA Anda."
        icon={<User className="h-8 w-8" />}
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Card: Informasi Dasar */}
          <NeoCard title="Informasi Dasar" icon={<User className="h-5 w-5" />}>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-black text-black">
                  Nama Lengkap
                </Label>
                <Input
                  id="full_name"
                  placeholder="Budi Santoso"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-black text-black">
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="bg-slate-50"
                />
              </div>
            </div>
          </NeoCard>

          {/* Card: Keamanan (Opsional) */}
          <NeoCard 
            title="Keamanan Account" 
            icon={<Shield className="h-5 w-5" />}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                <input 
                  type="checkbox" 
                  id="togglePassword"
                  checked={isChangingPassword}
                  onChange={(e) => setIsChangePassword(e.target.checked)}
                  className="h-5 w-5 rounded border-2 border-black accent-blue-600 cursor-pointer"
                />
                <Label htmlFor="togglePassword" className="font-bold cursor-pointer">Saya ingin mengubah password</Label>
              </div>

              {isChangingPassword && (
                <div className="grid gap-6 sm:grid-cols-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="pass" className="text-sm font-black text-black">
                      Password Baru
                    </Label>
                    <Input
                      id="pass"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-sm font-black text-black">
                      Konfirmasi Password
                    </Label>
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </NeoCard>

          {/* Verifikasi Akhir */}
          <div className="rounded-2xl border-2 border-black bg-blue-50 p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <Label htmlFor="current" className="text-sm font-black text-black">
                  Masukkan Password Saat Ini untuk Menyimpan
                </Label>
              </div>
              <Input
                id="current"
                type="password"
                placeholder="Konfirmasi identitas Anda"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="bg-white"
              />
              <p className="text-[10px] font-bold text-slate-400">
                Wajib diisi untuk setiap perubahan informasi profil demi keamanan akun Anda.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full px-12 sm:w-auto"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              }
            >
              {isLoading ? "Memproses..." : "Simpan Semua Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
