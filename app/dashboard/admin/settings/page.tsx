import { createClient } from "@/utils/supabase/server";
import { User, Lock, Save, AlertCircle, CheckCircle } from "lucide-react";
import { updateProfile, updatePassword } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();

  // 1. Ambil Data User yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Ambil Profil Detail
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // 3. Cek Pesan Error/Sukses dari URL
  // Di Next.js 15, searchParams harus di-await
  const params = await searchParams;
  const errorMsg = params.error as string;
  const successMsg = params.success as string;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Akun</h1>
        <p className="text-sm text-slate-500">Kelola profil pribadi dan keamanan akun Anda</p>
      </div>

      {/* Notifikasi Sukses/Gagal */}
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm border border-red-100">
          <AlertCircle className="h-4 w-4" /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2 text-sm border border-green-100">
          <CheckCircle className="h-4 w-4" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* FORM 1: Update Profil */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <User className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-slate-800">Profil Saya</h2>
          </div>

          <form action={updateProfile as any} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (Tidak bisa diubah)</label>
              <input 
                type="text" 
                value={user?.email || ""} 
                disabled 
                className="w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input 
                suppressHydrationWarning
                name="fullName" 
                type="text" 
                defaultValue={profile?.full_name || ""}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button 
              suppressHydrationWarning
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex justify-center items-center gap-2"
            >
              <Save className="h-4 w-4" /> Simpan Profil
            </button>
          </form>
        </div>

        {/* FORM 2: Ganti Password */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-slate-800">Ganti Password</h2>
          </div>

          <form action={updatePassword as any} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
              <input 
                suppressHydrationWarning
                name="password" 
                type="password" 
                placeholder="Minimal 6 karakter"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password</label>
              <input 
                suppressHydrationWarning
                name="confirmPassword" 
                type="password" 
                placeholder="Ulangi password baru"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <button 
              suppressHydrationWarning
              type="submit" 
              className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-900 flex justify-center items-center gap-2"
            >
              <Save className="h-4 w-4" /> Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}