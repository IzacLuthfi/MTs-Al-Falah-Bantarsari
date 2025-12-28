import { createClient } from "@/utils/supabase/server";
import { BookOpen, Users, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PilihKelasNilaiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Ambil Daftar Kelas yang Diajar oleh Guru Ini
  // Kita ambil dari tabel 'schedules' biar otomatis sesuai jadwal
  const { data: schedules } = await supabase
    .from("schedules")
    .select(`
      class_id,
      subject_id,
      classes (name),
      subjects (name, code, kkm)
    `)
    .eq("teacher_id", user.id);

  // 2. Hilangkan Duplikat
  // (Karena jadwal bisa Senin & Kamis untuk kelas yg sama, kita cuma butuh 1 kartu per kelas)
  const uniqueClasses = schedules?.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.class_id === value.class_id && t.subject_id === value.subject_id
    ))
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Input Nilai Siswa</h1>
        <p className="text-orange-100 text-sm">Pilih kelas dan mata pelajaran untuk mulai mengisi nilai.</p>
      </div>

      {(!uniqueClasses || uniqueClasses.length === 0) ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
           <div className="p-4 bg-orange-50 text-orange-600 rounded-full inline-block mb-4">
              <AlertCircle className="h-8 w-8" />
           </div>
           <h3 className="font-bold text-slate-800 text-lg">Tidak Ada Kelas</h3>
           <p className="text-slate-500 mt-2">Anda belum memiliki jadwal mengajar aktif.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueClasses.map((item: any, index) => (
            <div key={index} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                    KKM: {item.subjects?.kkm || 75}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {item.subjects?.name}
                </h3>
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Kelas {item.classes?.name}
                </p>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                <Link
                  // Kita kirim ID Kelas dan ID Mapel lewat URL
                  href={`/dashboard/guru/nilai/${item.class_id}/${item.subject_id}`}
                  className="flex items-center justify-between text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Mulai Input Nilai
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}