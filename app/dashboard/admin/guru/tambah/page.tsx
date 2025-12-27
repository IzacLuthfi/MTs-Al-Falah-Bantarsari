import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createTeacher } from "./actions";

export default function TambahGuruPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/admin/guru" 
          className="p-2 rounded-full hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Tambah Guru Baru</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form action={createTeacher as any} className="space-y-6">
          
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap & Gelar</label>
            <input 
              name="fullName" 
              type="text" 
              required 
              placeholder="Contoh: Drs. H. Ahmad Dahlan, M.Pd"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* NIP */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIP / NUPTK</label>
              <input 
                name="nip" 
                type="text" 
                required 
                placeholder="19800101..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">*Digunakan sebagai Username Login</p>
            </div>

            {/* Pendidikan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pendidikan Terakhir</label>
              <select 
                name="education" 
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none bg-white"
              >
                <option value="S1">S1 - Sarjana</option>
                <option value="S2">S2 - Magister</option>
                <option value="S3">S3 - Doktor</option>
                <option value="D3">D3 - Diploma</option>
                <option value="SMA">SMA / Sederajat</option>
              </select>
            </div>
          </div>

          {/* Info Login Otomatis */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
            <p className="font-semibold">Informasi Akun Login:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Email: <span className="font-mono">nip@guru.mts.id</span></li>
              <li>Password: <span className="font-mono">guru[nip]</span></li>
            </ul>
          </div>

          {/* Tombol Submit */}
          <button 
            suppressHydrationWarning={true}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition"
          >
            <Save className="h-5 w-5" />
            Simpan Data Guru
          </button>
        </form>
      </div>
    </div>
  );
}