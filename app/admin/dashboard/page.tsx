import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Users,
  MapPin,
  ArrowRight,
  Compass,
  LayoutDashboard,
  PieChart
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/core/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { NeoCard } from "@/components/admin/NeoCard";
import { pool } from "@/lib/db";

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Middleware should have caught this, but extra safety
  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  let totalWisata = 0;
  let categoryStats: { category: string; count: number }[] = [];

  try {
    const client = await pool.connect();
    try {
      const totalRes = await client.query("SELECT COUNT(*) FROM wisata");
      totalWisata = parseInt(totalRes.rows[0].count);

      const catRes = await client.query(
        "SELECT category, COUNT(*) as count FROM wisata GROUP BY category ORDER BY count DESC"
      );
      categoryStats = catRes.rows.map(row => ({
        category: row.category,
        count: parseInt(row.count)
      }));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 sm:p-10">
      <PageHeader
        title="Dashboard"
        description={`Selamat datang kembali, ${user.full_name}! 👋`}
        icon={<LayoutDashboard className="h-8 w-8 text-blue-600" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Stat Card */}
        <NeoCard variant="primary" className="flex flex-col justify-center items-center text-center p-8 py-12">
          <h3 className="text-sm font-bold text-black/70 mb-2 uppercase tracking-widest">Total Destinasi</h3>
          <span className="text-7xl font-black text-black">{totalWisata}</span>
        </NeoCard>
        
        {/* Simple Bar Chart Card */}
        <NeoCard className="lg:col-span-2">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" /> Distribusi Kategori
          </h3>
          <div className="space-y-4">
            {categoryStats.map((stat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-sm font-bold">
                  <span className="uppercase text-slate-700">{stat.category}</span>
                  <span className="text-black">{stat.count} Destinasi</span>
                </div>
                <div className="w-full h-4 bg-slate-200 rounded-full border-2 border-black overflow-hidden flex">
                  <div 
                    className="bg-[#6FD1D7] h-full border-r-2 border-black transition-all duration-1000 ease-out" 
                    style={{ width: totalWisata > 0 ? `${(stat.count / totalWisata) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
            {categoryStats.length === 0 && (
              <div className="text-slate-500 font-bold text-center py-6">Belum ada data destinasi</div>
            )}
          </div>
        </NeoCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card: Lihat Peta Publik */}
        <NeoCard
          title="Lihat Peta"
          description="Buka antarmuka peta publik untuk melihat hasil rekomendasi dan sebaran wisata secara langsung."
          icon={<Compass className="h-6 w-6" />}
          variant="white"
          asActionCard
        >
          <Link href="/maps" target="_blank">
            <Button variant="outline" className="bg-primary w-full mt-2">
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
              className="w-full mt-2"
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
                className="w-full mt-2"
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
