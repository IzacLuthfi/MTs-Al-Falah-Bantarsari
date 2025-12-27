import { createClient } from "@/utils/supabase/server";
import { Plus, Search, Trash2, Pencil, GraduationCap } from "lucide-react";
import Link from "next/link";

export default async function DataGuruPage() {
  const supabase = await createClient();

  // 1. Ambil data guru (Join ke table profiles)
  const { data: teachers, error } = await supabase
    .from("teachers")
    .select(`
      id,
      nip,
      education_level,
      is_active,
      profiles (full_name, email)
    `)
    .order("nip", { ascending: true });

  if (error) {
    console.error("Error fetching teachers:", JSON.stringify(error, null, 2));
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Guru</h1>
          <p className="text-sm text-slate-500">Manajemen tenaga pengajar & staff</p>
        </div>
        <Link
          href="/dashboard/admin/guru/tambah"
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          <Plus className="h-4 w-4" />
          Tambah Guru
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        <Search className="ml-2 h-4 w-4 text-slate-400" />
        <input
          suppressHydrationWarning={true}
          type="text"
          placeholder="Cari nama guru atau NIP..."
          className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0"
        />
      </div>

      {/* Tabel Data */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Nama Guru</th>
                <th className="px-6 py-3">NIP</th>
                <th className="px-6 py-3">Pendidikan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(teachers || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data guru. Silakan klik tombol "Tambah Guru".
                  </td>
                </tr>
              ) : (
                teachers?.map((guru: any) => (
                  <tr key={guru.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                           <GraduationCap className="h-4 w-4" />
                        </div>
                        <div>
                          {guru.profiles?.full_name || "Tanpa Nama"}
                          <div className="text-xs text-slate-400 font-normal">
                            {guru.profiles?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {guru.nip || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {guru.education_level || "S1"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        guru.is_active 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {guru.is_active ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="rounded p-1 text-blue-600 hover:bg-blue-50">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
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