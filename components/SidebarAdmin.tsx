"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCog, 
  GraduationCap, 
  Users, 
  BookOpen, 
  School, 
  LogOut,
  Shield,
  Settings 
} from "lucide-react";

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-slate-900 text-white md:block hidden z-50 flex flex-col">
      {/* Header Sidebar */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6 gap-3">
        <div className="bg-blue-600 p-1.5 rounded-lg">
           <Shield className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-100">Admin Panel</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        
        <Link
          href="/dashboard/admin"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname === "/dashboard/admin"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>

        {/* GROUP: KELOLA USER */}
        <div className="pt-6 pb-2">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Kelola User
          </p>
        </div>

        <Link
          href="/dashboard/admin/guru"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/dashboard/admin/guru") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <UserCog className="h-5 w-5" />
          Data Guru
        </Link>

        <Link
          href="/dashboard/admin/walikelas"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/dashboard/admin/walikelas") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <School className="h-5 w-5" />
          Data Wali Kelas
        </Link>

        <Link
          href="/dashboard/admin/siswa"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/dashboard/admin/siswa") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <GraduationCap className="h-5 w-5" />
          Data Siswa
        </Link>

        {/* GROUP: AKADEMIK */}
        <div className="pt-6 pb-2">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Akademik
          </p>
        </div>

        <Link
          href="/dashboard/admin/akademik/kelas"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/dashboard/admin/akademik/kelas") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Users className="h-5 w-5" />
          Data Kelas
        </Link>

        <Link
          href="/dashboard/admin/akademik/mapel"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/dashboard/admin/akademik/mapel") ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          Mata Pelajaran
        </Link>

      </nav>

      {/* FOOTER: SETTINGS & LOGOUT */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        
        <Link
          href="/dashboard/admin/settings"
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            pathname.startsWith("/dashboard/admin/settings")
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Settings className="h-5 w-5" />
          Pengaturan
        </Link>

        <form action="/auth/signout" method="post">
           {/* PERBAIKAN DI SINI: Tambahkan suppressHydrationWarning */}
           <button 
             suppressHydrationWarning
             className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
           >
             <LogOut className="h-5 w-5" />
             Keluar
           </button>
        </form>
      </div>
    </aside>
  );
}