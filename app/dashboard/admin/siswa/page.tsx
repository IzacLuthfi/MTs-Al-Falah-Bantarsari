import { createClient } from "@/utils/supabase/server";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import Link from "next/link";

export default async function DataSiswaPage() {
  const supabase = await createClient();

  // 1. Ambil data siswa (Join ke table profiles & classes)
  // Perbaikan syntax: menghapus ':id' agar Supabase mendeteksi relasi otomatis
  const { data: students, error } = await supabase
    .from("students")
    .select(`
      id,
      nis,
      nisn,
      status,
      profiles (full_name, email),
      classes (name)
    `)
    .order("nis", { ascending: true });

  if (error) {
    // Perbaikan log: Menggunakan JSON.stringify agar pesan error terlihat jelas
    console.error("Error fetching students:", JSON.stringify(error, null, 2));
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Siswa</h1>
          <p className="text-sm text-slate-500">Manajemen data seluruh siswa aktif</p>
        </div>
        <Link
          href="/dashboard/admin/siswa/tambah"
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          <Plus className="h-4 w-4" />
          Tambah Siswa
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        <Search className="ml-2 h-4 w-4 text-slate-400" />
        <input
          suppressHydrationWarning={true}
          type="text"
          placeholder="Cari nama atau NISN..."
          className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0"
        />
      </div>

      {/* Tabel Data */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Nama Siswa</th>
                <th className="px-6 py-3">NIS / NISN</th>
                <th className="px-6 py-3">Kelas</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Gunakan (students || []) agar tidak error jika data null/gagal fetch */}
              {(students || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    {error ? (
                      <span className="text-red-500">Gagal mengambil data. Cek Terminal VSCode.</span>
                    ) : (
                      "Belum ada data siswa. Silakan klik tombol 'Tambah Siswa'."
                    )}
                  </td>
                </tr>
              ) : (
                students?.map((siswa: any) => (
                  <tr key={siswa.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {siswa.profiles?.full_name || "Tanpa Nama"}
                      <div className="text-xs text-slate-400 font-normal">
                        {siswa.profiles?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {siswa.nis} <br />
                      <span className="text-xs text-slate-400">{siswa.nisn}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {siswa.classes?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        siswa.status === 'active' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {siswa.status === 'active' ? 'Aktif' : 'Non-Aktif'}
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