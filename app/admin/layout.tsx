import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Compass, 
  LayoutDashboard, 
  MapPin, 
  Users, 
  LogOut,
  ChevronRight,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
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
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-20 items-center border-b border-slate-100 px-6">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-100">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-800">SPARTA</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              // Hide menu if user doesn't have the required role
              if (item.role === "superadmin" && user.role !== "superadmin") {
                return null;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.title}
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-30" />
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout Section */}
          <div className="border-t border-slate-100 p-4">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-bold text-slate-800">{user.username}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{user.role}</span>
              </div>
            </div>
            
            <form action="/api/auth/logout" method="POST">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-64 flex-1">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
