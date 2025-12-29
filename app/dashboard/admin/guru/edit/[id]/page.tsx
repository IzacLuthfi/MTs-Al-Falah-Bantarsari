import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { updateTeacher } from "./actions";

export default async function EditGuruPage({ params, searchParams }: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ error?: string }> 
}) {
  const supabase = await createClient();
  const { id } = await params;
  const { error } = await searchParams;

  // Ambil Data Guru Existing
  const { data: guru, error: fetchError } = await supabase
    .from("teachers")
    .select(`
      nip, 
      education_level,
      is_active,
      profiles (full_name, email)
    `)
    .eq("id", id)
    .single();

  if (fetchError || !guru) {
    return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
            Data guru tidak ditemukan.
        </div>
    );
  }

  const profile = Array.isArray(guru.profiles) ? guru.profiles[0] : guru.profiles;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       
       <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/guru" className="p-2 rounded-full hover:bg-slate-100 transition">
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Edit Data Guru</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <form action={updateTeacher} className="space-y-6">
           <input type="hidden" name="id" value={id} />
           
           {/* 1. Nama Lengkap */}
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input 
                suppressHydrationWarning // <--- TAMBAHKAN INI
                name="fullName" 
                type="text" 
                required
                defaultValue={profile?.full_name} 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 2. NIP */}
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIP</label>
                <input 
                    suppressHydrationWarning // <--- TAMBAHKAN INI
                    name="nip" 
                    type="text" 
                    required
                    defaultValue={guru.nip} 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
               </div>

               {/* 3. Pendidikan Terakhir */}
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pendidikan</label>
                <select 
                    suppressHydrationWarning // <--- TAMBAHKAN INI
                    name="education" 
                    defaultValue={guru.education_level || "S1"} 
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="S1">S1 - Sarjana</option>
                    <option value="S2">S2 - Magister</option>
                    <option value="S3">S3 - Doktor</option>
                    <option value="D3">D3 - Diploma</option>
                    <option value="SMA">SMA / Sederajat</option>
                </select>
               </div>
           </div>

           {/* 4. Email */}
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email (Login)</label>
            <input 
                suppressHydrationWarning // <--- TAMBAHKAN INI
                name="email" 
                type="email" 
                required
                defaultValue={profile?.email} 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
            <p className="text-xs text-slate-500 mt-1">Mengubah email akan mengubah akses login guru ini.</p>
           </div>

           {/* 5. Status Keaktifan */}
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                suppressHydrationWarning // <--- TAMBAHKAN INI
                name="status" 
                defaultValue={guru.is_active ? 'true' : 'false'} 
                className={`w-full border rounded-lg px-4 py-2 outline-none font-medium ${
                    guru.is_active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                 <option value="true">Aktif (Bisa Login)</option>
                 <option value="false">Non-Aktif (Akses Ditutup)</option>
              </select>
           </div>

           <hr className="border-slate-100" />

           {/* Tombol Simpan */}
           <button 
             suppressHydrationWarning // <--- TAMBAHKAN INI
             type="submit" 
             className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
           >
             <Save className="h-5 w-5" />
             Simpan Perubahan
           </button>
        </form>
      </div>
    </div>
  );
}