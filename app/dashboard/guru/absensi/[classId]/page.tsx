import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, Save, Calendar } from "lucide-react";
import Link from "next/link";
import { saveAttendance } from "./actions";

export default async function FormAbsensiPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ date?: string; success?: string }>;
}) {
  const supabase = await createClient();
  const { classId } = await params;
  const { date, success } = await searchParams;

  // Tanggal default = Hari Ini (jika tidak dipilih)
  const selectedDate = date || new Date().toISOString().split('T')[0];

  // 1. Ambil Data Kelas
  const { data: kelas } = await supabase.from("classes").select("name").eq("id", classId).single();

  // 2. Ambil Siswa
  const { data: students } = await supabase
    .from("students")
    .select("id, nis, profiles(full_name)")
    .eq("current_class_id", classId)
    .order("nis", { ascending: true });

  // 3. Ambil Data Absensi yang sudah ada di tanggal tersebut (untuk default value)
  const { data: existingAttendance } = await supabase
    .from("attendance")
    .select("student_id, status")
    .eq("class_id", classId)
    .eq("date", selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/guru/absensi"
            className="p-2 rounded-full hover:bg-slate-200 transition"
          >
            <ArrowLeft className="h-6 w-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Absensi Kelas {kelas?.name}</h1>
            <p className="text-slate-500 text-sm">Silakan cek kehadiran siswa hari ini.</p>
          </div>
        </div>

        {/* Filter Tanggal */}
        <form className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
           <Calendar className="h-5 w-5 text-slate-400 ml-2" />
           <input 
             type="date" 
             name="date"
             defaultValue={selectedDate}
             className="outline-none text-slate-700 text-sm font-medium"
             // Trik sederhana: Auto submit saat tanggal ganti
             onInput={(e) => {
                 const form = e.currentTarget.form;
                 if(form) form.requestSubmit();
             }}
           />
           {/* Tombol refresh manual jika JS auto submit tidak jalan */}
           <button type="submit" className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">
             Cek
           </button>
        </form>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-medium text-sm">
          ✅ {success}
        </div>
      )}

      {/* FORM UTAMA */}
      <form action={saveAttendance as any} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <input type="hidden" name="classId" value={classId} />
        <input type="hidden" name="date" value={selectedDate} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 w-12 text-center">No</th>
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4 text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students?.map((student: any, index) => {
                // Cek status tersimpan, default 'Hadir'
                const record = existingAttendance?.find(a => a.student_id === student.id);
                const currentStatus = record?.status || "Hadir";
                
                // Ambil nama (aman array/object)
                const profileData = student.profiles;
                const fullName = Array.isArray(profileData) 
                    ? profileData[0]?.full_name 
                    : profileData?.full_name;

                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-center text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {fullName || "Siswa Tanpa Nama"}
                      </div>
                      <div className="text-xs text-slate-400">NIS: {student.nis}</div>
                      <input type="hidden" name="student_ids[]" value={student.id} />
                    </td>
                    <td className="px-6 py-4">
                      {/* Pilihan Radio Button */}
                      <div className="flex justify-center gap-4">
                         {['Hadir', 'Sakit', 'Izin', 'Alpha'].map((option) => (
                             <label key={option} className="flex flex-col items-center gap-1 cursor-pointer group">
                                <input 
                                   type="radio" 
                                   name={`status_${student.id}`} 
                                   value={option}
                                   defaultChecked={currentStatus === option}
                                   className="peer sr-only" // Sembunyikan radio asli
                                />
                                {/* Custom Radio Style */}
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all
                                    peer-checked:scale-110 peer-checked:shadow-md
                                    ${option === 'Hadir' ? 'peer-checked:bg-green-500 peer-checked:border-green-600 peer-checked:text-white border-slate-200 text-slate-400 bg-white' : ''}
                                    ${option === 'Sakit' ? 'peer-checked:bg-yellow-400 peer-checked:border-yellow-500 peer-checked:text-white border-slate-200 text-slate-400 bg-white' : ''}
                                    ${option === 'Izin' ? 'peer-checked:bg-blue-400 peer-checked:border-blue-500 peer-checked:text-white border-slate-200 text-slate-400 bg-white' : ''}
                                    ${option === 'Alpha' ? 'peer-checked:bg-red-500 peer-checked:border-red-600 peer-checked:text-white border-slate-200 text-slate-400 bg-white' : ''}
                                `}>
                                    {option.charAt(0)}
                                </div>
                                <span className="text-[10px] text-slate-400 group-hover:text-slate-600">{option}</span>
                             </label>
                         ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {(!students || students.length === 0) && (
                <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">
                        Tidak ada siswa di kelas ini.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end sticky bottom-0">
          <button 
            suppressHydrationWarning
            type="submit" 
            className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-700 transition shadow-lg"
          >
            <Save className="h-5 w-5" />
            Simpan Absensi
          </button>
        </div>
      </form>
    </div>
  );
}