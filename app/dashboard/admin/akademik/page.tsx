import { createClient } from "@/utils/supabase/server";
import { Plus, BookOpen, Trash2, Pencil } from "lucide-react";
import Link from "next/link";

export default async function AkademikPage() {
  const supabase = await createClient();

  // Ambil data mata pelajaran
  const { data: subjects, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching subjects:", JSON.stringify(error, null, 2));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Akademik & Mata Pelajaran</h1>
          <p className="text-sm text-slate-500">Daftar kurikulum mata pelajaran sekolah</p>
        </div>
        <Link
          href="/dashboard/admin/akademik/tambah"
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          <Plus className="h-4 w-4" />
          Tambah Mapel
        </Link>
      </div>

      {/* Tabel Mapel */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Kode</th>
                <th className="px-6 py-3">Nama Mata Pelajaran</th>
                <th className="px-6 py-3">KKM</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(subjects || []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Belum ada mata pelajaran.
                  </td>
                </tr>
              ) : (
                subjects?.map((mapel: any) => (
                  <tr key={mapel.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {mapel.code || "-"}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        {mapel.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                        {mapel.kkm || 75}
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