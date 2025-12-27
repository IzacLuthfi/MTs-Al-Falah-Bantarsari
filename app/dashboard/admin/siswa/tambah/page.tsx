import { createClient } from "@/utils/supabase/server";
import { createStudent } from "./actions"; // Pastikan file actions.ts ada di folder yang sama
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function TambahSiswaPage() {
  // 1. Inisialisasi Supabase (Wajib pakai 'await' di Next.js 15)
  const supabase = await createClient();

  // 2. Ambil data kelas untuk Dropdown
  const { data: classes, error } = await supabase
    .from("classes")
    .select("id, name")
    .order("name");

  // 3. Debugging: Jika ada error ambil kelas, tampilkan di terminal
  if (error) {
    console.error("Gagal mengambil data kelas:", error);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/admin/siswa" 
          className="p-2 rounded-full hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Tambah Siswa Baru</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form action={createStudent} className="space-y-6">
          
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input 
              name="fullName" 
              type="text" 
              required 
              placeholder="Contoh: Ahmad Dahlan"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* NIS (Nomor Induk Siswa) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIS (Nomor Induk)</label>
              <input 
                name="nis" 
                type="text" 
                required 
                placeholder="12345"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">*Digunakan untuk login (Username)</p>
            </div>

            {/* NISN */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NISN (Nasional)</label>
              <input 
                name="nisn" 
                type="text" 
                required 
                placeholder="0012345678"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kelas Saat Ini</label>
            <select 
              name="classId" 
              required
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none bg-white"
            >
              <option value="" disabled>-- Pilih Kelas --</option>
              {/* Gunakan (classes || []) untuk mencegah error jika data null */}
              {(classes || []).map((kelas: any) => (
                <option key={kelas.id} value={kelas.id}>Kelas {kelas.name}</option>
              ))}
            </select>
          </div>

          {/* Info Login Otomatis */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
            <p className="font-semibold">Informasi Akun Login:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Email otomatis: <span className="font-mono">nis@siswa.mts.id</span></li>
              <li>Password default: <span className="font-mono">siswa[nis]</span> (Contoh: siswa12345)</li>
            </ul>
          </div>

          {/* Tombol Submit */}
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition"
          >
            <Save className="h-5 w-5" />
            Simpan Data Siswa
          </button>
        </form>
      </div>
    </div>
  );
}