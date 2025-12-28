"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Users, FileSpreadsheet, Printer, LogOut, Briefcase 
} from "lucide-react";

export default function SidebarWali() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard/walikelas", icon: Home },
    { name: "Data Siswa", href: "/dashboard/walikelas/siswa", icon: Users },
    { name: "Leger Nilai", href: "/dashboard/walikelas/leger", icon: FileSpreadsheet },
    { name: "Cetak Rapor", href: "/dashboard/walikelas/rapor", icon: Printer },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-slate-900 text-white md:block hidden z-50 flex flex-col">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <span className="text-xl font-bold text-teal-400">Panel Wali Kelas</span>
      </div>

      <nav className="flex flex-col gap-1 p-4 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        {/* Tombol Balik ke Guru */}
        <Link 
            href="/dashboard/guru"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold bg-slate-800 text-orange-400 hover:bg-slate-700 border border-slate-700 transition-all"
        >
            <Briefcase className="h-5 w-5" />
            Mode Guru
        </Link>

        <form action="/auth/signout" method="post">
           <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300">
             <LogOut className="h-5 w-5" />
             Keluar
           </button>
        </form>
      </div>
    </aside>
  );
}