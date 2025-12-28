import { createClient } from "@/utils/supabase/server";
import { User, Save, MapPin, Phone, Calendar } from "lucide-react";
import { updateBiodata } from "./actions";

export default async function BiodataPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const supabase = await createClient();
  const params = await searchParams;

  // 1. Ambil Data Siswa (Join ke Profile & Kelas)
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: siswa } = await supabase
    .from("students")
    .select(`
      *,
      profiles(full_name, email),
      classes(name)
    `)
    .eq("id", user?.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Biodata Saya</h1>
        <p className="text-sm text-slate-500">Lengkapi data diri Anda untuk keperluan akademik.</p>
      </div>

      {/* Notifikasi Sukses/Gagal */}
      {params.success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
          ✅ {params.success}
        </div>
      )}
      {params.error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">
          ❌ {params.error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Profil Singkat */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                    {siswa?.profiles?.full_name?.charAt(0) || "S"}
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-800">{siswa?.profiles?.full_name}</h2>
                    <p className="text-slate-500 text-sm">{siswa?.profiles?.email}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                    Siswa Aktif
                </span>
                <p className="text-xs text-slate-400 mt-1">NIS: {siswa?.nis}</p>
            </div>
        </div>

        {/* Form Biodata */}
        <form action={updateBiodata as any} className="p-6 space-y-6">
            
            {/* Bagian 1: Info Akademik (Read Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nama Lengkap</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            disabled 
                            value={siswa?.profiles?.full_name || ""}
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-slate-600 cursor-not-allowed"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Kelas Saat Ini</label>
                    <div className="relative">
                        <div className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 font-bold text-xs">K</div>
                        <input 
                            type="text" 
                            disabled 
                            value={siswa?.classes?.name || "Belum Masuk Kelas"}
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-slate-600 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Bagian 2: Data Pribadi (Bisa Diedit) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Jenis Kelamin */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                    <select 
                        name="gender" 
                        defaultValue={siswa?.gender || ""}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">-- Pilih --</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>
                </div>

                {/* No HP */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">No. Handphone / WA</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            name="phone"
                            type="text" 
                            defaultValue={siswa?.phone || ""}
                            placeholder="0812..."
                            className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Tempat Lahir */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label>
                    <input 
                        name="birthPlace"
                        type="text" 
                        defaultValue={siswa?.birth_place || ""}
                        placeholder="Contoh: Cilacap"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Tanggal Lahir */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            name="birthDate"
                            type="date" 
                            defaultValue={siswa?.birth_date || ""}
                            className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Alamat (Full Width) */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <textarea 
                            name="address"
                            rows={3}
                            defaultValue={siswa?.address || ""}
                            placeholder="Nama Jalan, RT/RW, Desa, Kecamatan..."
                            className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 flex justify-end">
                <button 
                    suppressHydrationWarning
                    type="submit" 
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                >
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}