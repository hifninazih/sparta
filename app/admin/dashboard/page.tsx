import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Middleware should have caught this, but extra safety
  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="p-6 sm:p-10 space-y-8 bg-slate-50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Selamat datang kembali, {user.username} ({user.role})</p>
        </div>
        <div className="flex gap-3">
          <Link href="/maps" target="_blank">
            <Button variant="outline">Lihat Peta Publik</Button>
          </Link>
          <form action="/api/auth/logout" method="POST">
             <Button variant="destructive" type="submit">
                <LogOut className="h-4 w-4 mr-2" /> Keluar
             </Button>
          </form>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Pengelolaan Wisata */}
        <Card className="hover:shadow-lg transition-shadow border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Data Wisata</CardTitle>
            <MapPin className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-4">Kelola semua titik destinasi wisata di DIY beserta atribut SAW-nya.</p>
            <Link href="/admin/wisata">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Buka Pengelola <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: Pengelolaan Akun (Hanya Super Admin) */}
        {user.role === "superadmin" && (
          <Card className="hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Manajemen User</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">Buat akun admin baru, reset password, dan kelola peran akses.</p>
              <Link href="/admin/users">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Buka Manajemen <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Card 3: Statistik Sistem */}
        <Card className="hover:shadow-lg transition-shadow border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Status Keamanan</CardTitle>
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sesi Aktif</span>
                <span className="font-bold text-green-600">Aktif</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Role</span>
                <span className="font-bold text-slate-700 uppercase">{user.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
