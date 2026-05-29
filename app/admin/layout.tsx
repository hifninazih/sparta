"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Users,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/core/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/core/alert-dialog";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Berhasil keluar sistem. Sampai jumpa!");
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      toast.error("Gagal keluar. Silakan coba lagi.");
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      role: "all",
    },
    {
      title: "Data Wisata",
      href: "/admin/wisata",
      icon: <MapPin className="h-5 w-5" />,
      role: "all",
    },
    {
      title: "Manajemen User",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      role: "superadmin",
    },
    {
      title: "Profil Saya",
      href: "/admin/profile",
      icon: <UserIcon className="h-5 w-5" />,
      role: "all",
    },
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-[#DCFFBC]">
      {/* MOBILE HEADER */}
      <div className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b-2 border-black bg-white px-4 shadow-[0px_2px_0px_rgba(0,0,0,1)] lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-linear-to-tr from-[#DCFFBC] to-[#6FD1D7] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <Compass className="h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-black">
            SPARTA
          </span>
        </Link>
        <Button
          variant="outline"
          size="rect"
          className="h-10 w-10 border-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-72 border-r-2 border-black bg-white transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-24 items-center border-b-2 border-black px-6">
            <Link href="/admin" className="group flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-linear-to-tr from-[#DCFFBC] to-[#6FD1D7] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <Compass className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl leading-none font-black tracking-tighter text-black drop-shadow-sm">
                  SPARTA
                </span>
                <span className="mt-1 text-[10px] font-black tracking-widest text-slate-800 uppercase">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {menuItems.map((item) => {
              if (item.role === "superadmin" && user.role !== "superadmin")
                return null;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "group flex items-center justify-between rounded-lg border-2 px-4 py-3 text-sm font-bold transition-all",
                    isActive
                      ? "-translate-y-0.5 border-black bg-linear-to-tr from-[#DCFFBC] to-[#6FD1D7] text-black shadow-[2px_3px_0px_rgba(0,0,0,1)]"
                      : "border-transparent text-slate-600 hover:-translate-y-0.5 hover:border-black/50 hover:shadow-[2px_3px_0px_rgba(0,0,0,0.5)]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        isActive ? "text-black" : "text-slate-500",
                        "group-hover:text-slate-500",
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.title}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout Section */}
          <div className="mt-auto border-t-2 border-black bg-slate-100 p-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="h-12 w-full border-2 text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                  startIcon={<LogOut className="mr-2 h-4 w-4" />}
                >
                  Keluar Sistem
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin keluar dari sistem SPARTA? Sesi Anda
                    akan berakhir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Ya, Keluar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-72">
        <div className="min-h-screen pt-24 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
