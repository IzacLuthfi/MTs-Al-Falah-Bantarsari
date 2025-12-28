import { createClient } from "@/utils/supabase/server";
import { Users, ArrowRight, CalendarCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PilihKelasAbsensiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Ambil Kelas dari Jadwal Guru
  // (Kita anggap guru bisa mengabsen kelas yang dia ajar)
  const { data: schedules } = await supabase
    .from("schedules")
    .select("class_id, classes(name)")
    .eq("teacher_id", user.id);

  // 2. Hilangkan Duplikat Kelas
  // (Misal guru ngajar 7A hari Senin & Kamis, cukup tampilkan 1 kartu 7A)
  const uniqueClasses = schedules?.filter((value, index, self) =>
    index === self.findIndex((t) => t.class_id === value.class_id)
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Absensi Siswa</h1>
        <p className="text-teal-100 text-sm">Catat kehadiran siswa di kelas Anda setiap hari.</p>
      </div>

      {(!uniqueClasses || uniqueClasses.length === 0) ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
           <div className="p-4 bg-teal-50 text-teal-600 rounded-full inline-block mb-4">
              <AlertCircle className="h-8 w-8" />
           </div>
           <h3 className="font-bold text-slate-800 text-lg">Tidak Ada Kelas</h3>
           <p className="text-slate-500 mt-2">Anda belum memiliki jadwal mengajar aktif.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {uniqueClasses.map((item: any, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-800">
                        Kelas {item.classes?.name}
                     </h3>
                     <p className="text-slate-500 text-xs">Kelola Kehadiran</p>
                  </div>
                </div>
                
                <Link
                  href={`/dashboard/guru/absensi/${item.class_id}`}
                  className="flex items-center justify-between w-full bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 px-4 py-3 rounded-lg text-sm font-bold transition-colors"
                >
                  Buka Absensi
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