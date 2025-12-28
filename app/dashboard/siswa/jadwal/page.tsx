import { createClient } from "@/utils/supabase/server";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function JadwalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Cek Kelas Siswa
  const { data: student } = await supabase
    .from("students")
    .select("current_class_id, classes(name)")
    .eq("id", user.id)
    .single();

  const classId = student?.current_class_id;

  // --- PERBAIKAN ERROR TYPE SCRIPT DI SINI ---
  // Kita gunakan 'as any' untuk memberi tahu TypeScript agar tidak rewel,
  // lalu kita cek apakah dia Array atau Object biasa.
  const classesData = student?.classes as any;
  const className = Array.isArray(classesData) 
    ? classesData[0]?.name // Jika array, ambil yang pertama
    : classesData?.name;   // Jika object, ambil langsung
  // -------------------------------------------

  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 bg-orange-100 text-orange-600 rounded-full mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Belum Masuk Kelas</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          Akun Anda belum dimasukkan ke dalam kelas manapun oleh Admin. Silakan hubungi Wali Kelas atau Tata Usaha.
        </p>
      </div>
    );
  }

  // 2. Ambil Jadwal Sesuai Kelas
  const { data: schedules } = await supabase
    .from("schedules")
    .select(`
      id,
      day,
      start_time,
      end_time,
      subjects (name, code),
      teachers (profiles(full_name))
    `)
    .eq("class_id", classId)
    .order("start_time", { ascending: true }); 

  // 3. Grouping Jadwal per Hari
  const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const groupedSchedules: Record<string, any[]> = {};

  daysOrder.forEach(day => {
    groupedSchedules[day] = schedules?.filter(s => s.day === day) || [];
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Jadwal Pelajaran</h1>
            <p className="text-blue-100 text-sm">Kelas {className} • Tahun Ajaran 2024/2025</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOrder.map((day) => {
          const dailySchedules = groupedSchedules[day];
          if (dailySchedules.length === 0) return null;

          return (
            <div key={day} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Header Hari */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">{day}</h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {dailySchedules.length} Mapel
                </span>
              </div>

              {/* List Mapel */}
              <div className="divide-y divide-slate-100 flex-1">
                {dailySchedules.map((schedule: any) => (
                  <div key={schedule.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {schedule.subjects?.name || "Tanpa Nama Mapel"}
                      </h4>
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {schedule.subjects?.code}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-green-600" />
                        <span>
                          {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <User className="h-3.5 w-3.5 text-blue-600" />
                        <span className="truncate max-w-[200px]">
                          {schedule.teachers?.profiles?.full_name || "Guru Belum Set"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.values(groupedSchedules).every(arr => arr.length === 0) && (
             <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                <Calendar className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <p>Belum ada jadwal pelajaran yang dirilis untuk kelas ini.</p>
             </div>
        )}
      </div>
    </div>
  );
}