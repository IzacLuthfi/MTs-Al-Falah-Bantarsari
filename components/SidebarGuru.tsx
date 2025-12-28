"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  PenTool, 
  UserCheck,
  LogOut 
} from "lucide-react";

export default function SidebarGuru() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard/guru", icon: Home },
    { name: "Jadwal Mengajar", href: "/dashboard/guru/jadwal", icon: Calendar },
    { name: "Input Nilai", href: "/dashboard/guru/nilai", icon: PenTool },
    { name: "Absensi Siswa", href: "/dashboard/guru/absensi", icon: UserCheck },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white text-slate-900 md:block hidden z-50">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <span className="text-xl font-bold text-orange-600">Portal Guru</span>
      </div>

      <nav className="flex flex-col gap-1 p-4 h-[calc(100vh-4rem)] overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-50 text-orange-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        {/* Tombol Logout */}
        <form action="/auth/signout" method="post" className="mt-auto pt-4 pb-4">
           <button 
             suppressHydrationWarning={true} 
             className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
           >
             <LogOut className="h-5 w-5" />
             Keluar
           </button>
        </form>
      </nav>
    </aside>
  );
}