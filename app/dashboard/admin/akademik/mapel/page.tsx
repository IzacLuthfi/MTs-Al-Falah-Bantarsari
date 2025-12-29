import { createClient } from "@/utils/supabase/server";
import { Plus, BookOpen, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { deleteSubject } from "./actions"; // Import action hapus tadi

export default async function MapelPage() {
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
          <h1 className="text-2xl font-bold text-slate-800">Mata Pelajaran</h1>
          <p className="text-sm text-slate-500">Daftar kurikulum mata pelajaran sekolah</p>
        </div>
        
        {/* Link Tambah diarahkan ke folder mapel/tambah */}
        <Link
          href="/dashboard/admin/akademik/mapel/tambah"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Mapel
        </Link>
      </div>

      {/* Tabel Mapel */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Kode</th>
                <th className="px-6 py-4">Nama Mata Pelajaran</th>
                <th className="px-6 py-4">KKM</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(subjects || []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    Belum ada mata pelajaran yang ditambahkan.
                  </td>
                </tr>
              ) : (
                subjects?.map((mapel: any) => (
                  <tr key={mapel.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500 font-medium">
                      {mapel.code || "-"}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        {mapel.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        (mapel.kkm || 75) >= 75 
                          ? "bg-green-100 text-green-700" 
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {mapel.kkm || 75}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Tombol Edit */}
                        <Link 
                            href={`/dashboard/admin/akademik/mapel/edit/${mapel.id}`}
                            className="rounded p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        {/* Tombol Hapus (Functional) */}
                        <form action={deleteSubject}>
                            <input type="hidden" name="id" value={mapel.id} />
                            <button 
                                type="submit" 
                                className="rounded p-2 text-red-600 hover:bg-red-50 transition-colors"
                                // confirm sederhana dengan browser alert (opsional)
                                // onClick={(e) => !confirm('Yakin hapus mapel ini?') && e.preventDefault()}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                        </form>
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