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
import { PieChart as PieChartIcon } from "lucide-react";
import { InteractivePieChart } from "@/components/admin/InteractivePieChart";
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
  let kecamatanStats: { name: string; kabupaten: string; count: number }[] = [];
  let kabupatenStats: { name: string; count: number }[] = [];

  try {
    const client = await pool.connect();
    try {
      const totalRes = await client.query("SELECT COUNT(*) FROM destinasi");
      totalWisata = parseInt(totalRes.rows[0].count);

      const catRes = await client.query(
        "SELECT c.nama as category, COUNT(w.gid) as count FROM destinasi w LEFT JOIN kategori c ON w.kategori_id = c.id GROUP BY c.nama ORDER BY count DESC"
      );
      categoryStats = catRes.rows.map((row) => ({
        category: row.category,
        count: parseInt(row.count),
      }));

      // Spatial Query: Menghitung jumlah wisata per kecamatan
      const kecRes = await client.query(`
        SELECT 
          d.wadmkc as name, 
          d.wadmkk as kabupaten,
          COUNT(w.gid) as count
        FROM public.administrasi_desa d
        JOIN destinasi w ON ST_Intersects(d.geom, w.geom)
        GROUP BY d.wadmkc, d.wadmkk
        ORDER BY count DESC
        LIMIT 5
      `);
      kecamatanStats = kecRes.rows.map((row) => ({
        name: row.name,
        kabupaten: row.kabupaten,
        count: parseInt(row.count),
      }));

      // Spatial Query: Menghitung jumlah wisata per kabupaten
      const kabRes = await client.query(`
        SELECT 
          d.wadmkk as name, 
          COUNT(w.gid) as count
        FROM public.administrasi_desa d
        JOIN destinasi w ON ST_Intersects(d.geom, w.geom)
        GROUP BY d.wadmkk
        ORDER BY count DESC
        LIMIT 5
      `);
      kabupatenStats = kabRes.rows.map((row) => ({
        name: row.name,
        count: parseInt(row.count),
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
        
        {/* Interactive Pie Chart Card - Kategori */}
        <NeoCard className="lg:col-span-2 flex flex-col">
          <InteractivePieChart 
            title="Distribusi Kategori"
            icon={<PieChartIcon className="w-5 h-5 text-blue-600" />}
            data={categoryStats.map(s => ({ name: s.category, count: s.count }))}
            total={totalWisata}
            colors={["#DCFFBC", "#6FD1D7", "#FFA9A9", "#FFE156", "#B983FF", "#FFA62B", "#4ECDC4", "#FF92A5"]}
            emptyMessage="Belum ada data destinasi"
          />
        </NeoCard>

        {/* Interactive Pie Chart Card - Kabupaten */}
        <NeoCard className="lg:col-span-2 flex flex-col">
          <InteractivePieChart 
            title="Distribusi Kab/Kota"
            icon={<PieChartIcon className="w-5 h-5 text-purple-600" />}
            data={kabupatenStats}
            total={totalWisata}
            colors={["#FF92A5", "#4ECDC4", "#FFE156", "#B983FF", "#FFA62B", "#6FD1D7"]}
            emptyMessage="Belum ada sebaran wilayah"
          />
        </NeoCard>

        {/* Top Kecamatan Card */}
        <NeoCard className="lg:col-span-1">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" /> Top Kecamatan
          </h3>
          <div className="space-y-4">
            {kecamatanStats.map((stat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-sm font-bold">
                  <div className="flex flex-col mr-2 truncate">
                    <span className="uppercase text-slate-700 truncate" title={stat.name}>{stat.name || "Unknown"}</span>
                    {stat.kabupaten && <span className="text-[10px] text-slate-500 uppercase">{stat.kabupaten}</span>}
                  </div>
                  <span className="text-black shrink-0">{stat.count}</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full border border-black overflow-hidden flex">
                  <div 
                    className="bg-[#DCFFBC] h-full border-r border-black transition-all duration-1000 ease-out" 
                    style={{ width: totalWisata > 0 ? `${(stat.count / totalWisata) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
            {kecamatanStats.length === 0 && (
              <div className="text-slate-500 font-bold text-center py-6 text-sm">Belum ada sebaran wilayah</div>
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
