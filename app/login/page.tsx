"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Compass, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(
          data.message || "Gagal masuk. Periksa kembali username dan password.",
        );
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 font-sans selection:bg-[#DCFFBC]">
      <div className="w-full max-w-sm">
        {/* Header / Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-blue-600 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <Compass className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-black">
            SPARTA ADMIN
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Sistem Pemetaan dan Rekomendasi Wisata
          </p>
        </div>

        {/* Neo-Brutalism Card */}
        <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-black text-black">Login Akses</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Masukkan kredensial untuk mengelola data.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 rounded-md border-2 border-black bg-red-100 p-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm font-bold text-red-800">{error}</p>
              </div>
            )}

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
