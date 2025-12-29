import { createClient } from "@/utils/supabase/server";
import { Plus, Users, Trash2, Pencil, School } from "lucide-react";
import Link from "next/link";
import { deleteClass } from "./actions";

export default async function DataKelasPage() {
  const supabase = await createClient();

  // Ambil data Kelas + Info Wali Kelas (Join ke tabel teachers -> profiles)
  const { data: classes, error } = await supabase
    .from("classes")
    .select(`
      id,
      name,
      level,
      teachers (
        profiles (full_name)
      )
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching classes:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Kelas & Wali Kelas</h1>
          <p className="text-sm text-slate-500">Manajemen rombongan belajar dan wali kelas</p>
        </div>
        
        <Link
          href="/dashboard/admin/akademik/kelas/tambah"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Kelas
        </Link>
      </div>

      {/* Tabel Kelas */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Kelas</th>
                <th className="px-6 py-4">Tingkat</th>
                <th className="px-6 py-4">Wali Kelas</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(classes || []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    Belum ada data kelas.
                  </td>
                </tr>
              ) : (
                classes?.map((item: any) => {
                  // Ambil nama wali kelas (karena bentuknya nested object)
                  const waliName = item.teachers?.profiles?.full_name || "Belum ditentukan";
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                                <School className="h-5 w-5" />
                            </div>
                            {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                          Kelas {item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-slate-400" />
                           <span className={!item.teachers ? "text-red-500 italic text-xs" : "text-slate-700"}>
                             {waliName}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Tombol Edit */}
                          <Link 
                              href={`/dashboard/admin/akademik/kelas/edit/${item.id}`}
                              className="rounded p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          {/* Tombol Hapus */}
                          <form action={deleteClass}>
                              <input type="hidden" name="id" value={item.id} />
                              <button 
                                  type="submit" 
                                  className="rounded p-2 text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}