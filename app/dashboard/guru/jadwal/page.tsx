import { createClient } from "@/utils/supabase/server";
import { Calendar, Clock, MapPin, BookOpen, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function JadwalGuruPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Ambil Jadwal Mengajar Guru Ini
  const { data: schedules } = await supabase
    .from("schedules")
    .select(`
      id,
      day,
      start_time,
      end_time,
      classes (name),
      subjects (name, code)
    `)
    .eq("teacher_id", user.id) // Filter punya guru ini saja
    .order("start_time", { ascending: true });

  // 2. Grouping per Hari
  const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const groupedSchedules: Record<string, any[]> = {};

  daysOrder.forEach(day => {
    groupedSchedules[day] = schedules?.filter(s => s.day === day) || [];
  });

  // Hitung total jam mengajar (sekedar info)
  const totalClasses = schedules?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Jadwal Mengajar</h1>
            <p className="text-orange-100 text-sm">Total Beban Mengajar: {totalClasses} Sesi / Minggu</p>
          </div>
        </div>
      </div>

      {/* Grid Jadwal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOrder.map((day) => {
          const dailySchedules = groupedSchedules[day];
          
          // Tampilkan kartu hari meskipun kosong (biar guru tahu dia libur hari itu)
          // Opsional: Kalau mau hide hari kosong, uncomment baris bawah:
          // if (dailySchedules.length === 0) return null;

          return (
            <div key={day} className={`rounded-xl border shadow-sm overflow-hidden flex flex-col ${
              dailySchedules.length > 0 ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60"
            }`}>
              {/* Header Hari */}
              <div className={`px-4 py-3 border-b flex justify-between items-center ${
                 dailySchedules.length > 0 ? "bg-orange-50 border-orange-100" : "bg-slate-100 border-slate-200"
              }`}>
                <h3 className={`font-bold ${dailySchedules.length > 0 ? "text-orange-800" : "text-slate-500"}`}>
                  {day}
                </h3>
                {dailySchedules.length > 0 && (
                  <span className="text-xs font-medium px-2 py-1 bg-white text-orange-600 rounded-full border border-orange-200">
                    {dailySchedules.length} Kelas
                  </span>
                )}
              </div>

              {/* List Kelas */}
              <div className="divide-y divide-slate-100 flex-1 p-0">
                {dailySchedules.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 italic">
                    Tidak ada jadwal mengajar
                  </div>
                ) : (
                  dailySchedules.map((schedule: any) => (
                    <div key={schedule.id} className="p-4 hover:bg-slate-50 transition group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-slate-800 text-lg">
                             {schedule.classes?.name || "?"}
                           </span>
                        </div>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded group-hover:bg-white group-hover:border group-hover:border-slate-200 transition-all">
                          {schedule.subjects?.code}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span>{schedule.subjects?.name}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="h-3.5 w-3.5 text-green-600" />
                            <span>
                              {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)} WIB
                            </span>
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Alert jika belum ada jadwal sama sekali */}
      {totalClasses === 0 && (
         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p>Jadwal mengajar Anda belum diatur oleh Kurikulum/Admin.</p>
         </div>
      )}
    </div>
  );
}