import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Users, GraduationCap } from "lucide-react";

export default async function GuruDashboardPage() {
  const supabase = await createClient();

  // 1. Ambil User Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // 2. Ambil Data Guru (Join ke Profiles)
  const { data: guru } = await supabase
    .from("teachers")
    .select(`
      *,
      profiles(full_name, email)
    `)
    .eq("id", user.id)
    .single();

  if (!guru) {
    return <div className="p-8 text-red-500">Data guru tidak ditemukan. Hubungi Admin.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Kartu Sambutan */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Selamat Datang, Bapak/Ibu Guru! 👋</h1>
        <p className="opacity-90 text-lg">{guru.profiles?.full_name}</p>
        
        <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>NIP: {guru.nip}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Status: {guru.is_active ? "Aktif Mengajar" : "Cuti/Non-Aktif"}</span>
            </div>
        </div>
      </div>

      {/* Shortcut Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="p-3 bg-blue-100 w-fit rounded-lg text-blue-600 mb-4">
                <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Jadwal Hari Ini</h3>
            <p className="text-sm text-slate-500">
                Lihat jadwal mengajar Anda dan persiapkan materi pembelajaran.
            </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="p-3 bg-green-100 w-fit rounded-lg text-green-600 mb-4">
                <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Wali Kelas</h3>
            <p className="text-sm text-slate-500">
               Kelola data siswa di kelas yang Anda ampu sebagai Wali Kelas.
            </p>
        </div>
      </div>
    </div>
  );
}