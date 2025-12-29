import { createClient } from "@/utils/supabase/server";
import { Plus, GraduationCap, AlertCircle, Pencil, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Search from "@/components/Search";
import DeleteButton from "@/components/DeleteButton"; // <--- Import Component Delete Baru

export default async function DataGuruPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; error?: string; success?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  
  // Ambil parameter dari URL
  const query = params?.query || '';
  const errorMsg = params?.error;
  const successMsg = params?.success;

  // 1. Base Query
  let dataQuery = supabase
    .from("teachers")
    .select(`
      id,
      nip,
      education_level,
      is_active,
      profiles!inner (full_name, email)
    `)
    .order("nip", { ascending: true });

  // 2. Logic Pencarian
  if (query) {
    const isNumber = /^[0-9]+$/.test(query);
    if (isNumber) {
      dataQuery = dataQuery.ilike('nip', `%${query}%`);
    } else {
      dataQuery = dataQuery.filter('profiles.full_name', 'ilike', `%${query}%`);
    }
  }

  const { data: teachers, error } = await dataQuery;

  if (error) {
    console.error("Error fetching teachers:", JSON.stringify(error, null, 2));
  }

  return (
    <div className="space-y-6">
      
      {/* Notifikasi Error/Sukses (Backup jika tidak pakai SweetAlert) */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMsg}
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Guru</h1>
          <p className="text-sm text-slate-500">Manajemen tenaga pengajar & staff</p>
        </div>
        <Link
          href="/dashboard/admin/guru/tambah"
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Guru
        </Link>
      </div>

      {/* Search Bar */}
      <div className="w-full md:w-1/3">
         <Search placeholder="Cari nama guru atau NIP..." />
      </div>

      {/* Tabel Data */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-[25%]">Nama Guru</th>
                <th className="px-6 py-4 w-[15%]">NIP</th>
                <th className="px-6 py-4 w-[20%]">Email</th>
                <th className="px-6 py-4 w-[10%]">Pendidikan</th>
                <th className="px-6 py-4 w-[10%]">Status</th>
                <th className="px-6 py-4 w-[20%] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(teachers || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <AlertCircle className="h-8 w-8 text-slate-300" />
                       <p>Data tidak ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                teachers?.map((guru: any) => (
                  <tr key={guru.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
                           <GraduationCap className="h-4 w-4" />
                        </div>
                        <div className="truncate font-medium text-slate-900">
                           {guru.profiles?.full_name || "Tanpa Nama"}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 font-mono text-slate-500">{guru.nip || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 truncate">{guru.profiles?.email}</td>
                    <td className="px-6 py-4">{guru.education_level || "S1"}</td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        guru.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {guru.is_active ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>

                    {/* KOLOM AKSI (EDIT & HAPUS) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        
                        {/* 1. Tombol EDIT (Link) */}
                        <Link 
                          href={`/dashboard/admin/guru/edit/${guru.id}`}
                          className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Link>

                        {/* 2. Tombol HAPUS (Component SweetAlert) */}
                        {/* Kita panggil komponen DeleteButton disini */}
                        <DeleteButton 
                            id={guru.id} 
                            nama={guru.profiles?.full_name || "Guru"} 
                        />

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}