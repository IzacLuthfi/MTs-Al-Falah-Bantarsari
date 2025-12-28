"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Calendar, PenTool, UserCheck, LogOut, School 
} from "lucide-react";

// Terima props di sini
export default function SidebarGuru({ isWaliKelas }: { isWaliKelas: boolean }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard/guru", icon: Home },
    { name: "Jadwal Mengajar", href: "/dashboard/guru/jadwal", icon: Calendar },
    { name: "Input Nilai", href: "/dashboard/guru/nilai", icon: PenTool },
    { name: "Absensi Siswa", href: "/dashboard/guru/absensi", icon: UserCheck },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white text-slate-900 md:block hidden z-50 flex flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <span className="text-xl font-bold text-orange-600">Portal Guru</span>
      </div>

      <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
      </nav>

      {/* Bagian Bawah: Tombol Switch & Logout */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        
        {/* HANYA MUNCUL JIKA DIA WALI KELAS */}
        {isWaliKelas && (
          <Link 
            href="/dashboard/walikelas"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-md transition-all"
          >
            <School className="h-5 w-5" />
            Mode Wali Kelas
          </Link>
        )}

        <form action="/auth/signout" method="post">
           <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
             <LogOut className="h-5 w-5" />
             Keluar
           </button>
        </form>
      </div>
    </aside>
  );
}