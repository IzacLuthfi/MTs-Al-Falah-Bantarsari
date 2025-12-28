import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User, Book, Calendar } from "lucide-react";

export default async function SiswaDashboardPage() {
  const supabase = await createClient();

  // 1. Ambil User Login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // 2. Ambil Data Detail Siswa (Join Kelas & Profile)
  const { data: siswa } = await supabase
    .from("students")
    .select(`
      *,
      profiles(full_name),
      classes(name)
    `)
    .eq("id", user.id)
    .single();

  if (!siswa) {
    return <div className="p-8 text-red-500">Data siswa tidak ditemukan. Hubungi Admin.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Halo, {siswa.profiles?.full_name}! 👋</h1>
        <p className="opacity-90">Selamat datang di Portal Siswa MTs Al Falah.</p>
        
        <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>NIS: {siswa.nis}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Kelas {siswa.classes?.name}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Jadwal Hari Ini
            </h3>
            <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500 text-sm">
                Belum ada jadwal pelajaran yang aktif.
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Book className="h-5 w-5 text-green-600" />
                Pengumuman Sekolah
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
                Ujian Semester Ganjil akan dilaksanakan mulai tanggal 15 Desember. Harap persiapkan diri dengan baik dan lunasi administrasi.
            </p>
        </div>
      </div>
    </div>
  );
}