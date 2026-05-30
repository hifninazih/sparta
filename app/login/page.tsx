"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import {
  Compass,
  Loader2,
  MapPin,
  Mountain,
  Palmtree,
  Map,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login berhasil! Selamat datang kembali.");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(
          data.message || "Gagal masuk. Periksa kembali username dan password.",
        );
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f8fafc] px-4 font-sans selection:bg-[#DCFFBC]">
      {/* Background Patterns & Decorative Elements */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Floating Decorative Icons */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <MapPin className="absolute top-[10%] left-[10%] h-12 w-12 -rotate-12 text-blue-500 opacity-20" />
        <Mountain className="absolute top-[20%] right-[15%] h-16 w-16 rotate-12 text-green-500 opacity-20" />
        <Palmtree className="absolute bottom-[15%] left-[12%] h-20 w-20 -rotate-6 text-orange-400 opacity-20" />
        <Map className="absolute right-[10%] bottom-[20%] h-14 w-14 rotate-6 text-purple-500 opacity-20" />
        <Navigation className="absolute top-[60%] left-[5%] h-10 w-10 rotate-45 text-red-400 opacity-20" />
        <Compass className="absolute top-[40%] right-[5%] h-24 w-24 -rotate-12 text-slate-800 opacity-10" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Header / Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-black bg-blue-600 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <Compass className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-black">
            SPARTA <span className="text-blue-600">ADMIN</span>
          </h1>
          <div className="mt-2 rounded-full border-2 border-black bg-[#DCFFBC] px-3 py-1 text-xs font-black tracking-wider text-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Sistem Pemetaan & Rekomendasi
          </div>
        </div>

        {/* Neo-Brutalism Card */}
        <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[12px_12px_0px_rgba(0,0,0,1)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-black text-black">Login Akses</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Masukkan kredensial untuk mengelola data.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-bold text-black"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="superadmin"
                required
                className="h-12 border-2 border-black bg-white text-base shadow-[2px_2px_0px_rgba(0,0,0,1)] focus-visible:shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-visible:ring-0"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-bold text-black"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-12 border-2 border-black bg-white text-base shadow-[2px_2px_0px_rgba(0,0,0,1)] focus-visible:shadow-[4px_4px_0px_rgba(0,0,0,1)] focus-visible:ring-0"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="h-12 w-full text-base shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-xs font-bold tracking-wider text-slate-400 uppercase">
          © 2026 SPARTA
        </p>
      </div>
    </div>
  );
}
