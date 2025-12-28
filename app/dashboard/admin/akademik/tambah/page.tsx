import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createSubject } from "./actions";

export default function TambahMapelPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/admin/akademik" 
          className="p-2 rounded-full hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Tambah Mata Pelajaran</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form action={createSubject as any} className="space-y-6">
          
          {/* Nama Mapel */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Mata Pelajaran</label>
            <input 
              name="name" 
              type="text" 
              required 
              placeholder="Contoh: Matematika Wajib"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Kode Mapel */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kode Mapel (Singkatan)</label>
              <input 
                name="code" 
                type="text" 
                required 
                placeholder="MTK"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none uppercase"
              />
            </div>

            {/* KKM */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">KKM (Nilai Minimal)</label>
              <input 
                name="kkm" 
                type="number" 
                required 
                defaultValue={75}
                min={0}
                max={100}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <button 
            suppressHydrationWarning={true}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition"
          >
            <Save className="h-5 w-5" />
            Simpan Mata Pelajaran
          </button>
        </form>
      </div>
    </div>
  );
}