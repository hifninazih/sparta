import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Users,
  MapPin,
  ArrowRight,
  Compass,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/core/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { NeoCard } from "@/components/admin/NeoCard";

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Middleware should have caught this, but extra safety
  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 sm:p-10">
      <PageHeader
        title="Dashboard"
        description={`Selamat datang kembali, ${user.full_name}! 👋`}
        icon={<LayoutDashboard className="h-8 w-8 text-blue-600" />}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Card: Lihat Peta Publik */}
        <NeoCard
          title="Lihat Peta"
          description="Buka antarmuka peta publik untuk melihat hasil rekomendasi dan sebaran wisata secara langsung."
          icon={<Compass className="h-6 w-6" />}
          variant="white"
          asActionCard
        >
          <Link href="/maps" target="_blank">
            <Button variant="outline" className="bg-primary w-full">
              Buka Peta Publik
            </Button>
          </Link>
        </NeoCard>

        {/* Card 1: Pengelolaan Wisata */}
        <NeoCard
          title="Data Wisata"
          description="Kelola semua titik destinasi wisata di DIY beserta atribut kriteria rekomendasi (SAW)."
          icon={<MapPin className="h-6 w-6" />}
          asActionCard
        >
          <Link href="/admin/wisata">
            <Button
              className="w-full"
              endIcon={<ArrowRight className="ml-1 h-4 w-4" />}
            >
              Buka Pengelola
            </Button>
          </Link>
        </NeoCard>

        {/* Card 2: Pengelolaan Akun (Hanya Super Admin) */}
        {user.role === "superadmin" && (
          <NeoCard
            title="Manajemen User"
            description="Buat akun admin baru, reset password, dan kelola peran akses tingkat sistem."
            icon={<Users className="h-6 w-6" />}
            asActionCard
          >
            <Link href="/admin/users">
              <Button
                className="w-full"
                endIcon={<ArrowRight className="ml-1 h-4 w-4" />}
              >
                Buka Manajemen
              </Button>
            </Link>
          </NeoCard>
        )}
      </div>
    </div>
  );
}
