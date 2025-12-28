import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { saveGrades } from "./actions";

export default async function InputNilaiPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string; subjectId: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const supabase = await createClient();
  
  const { classId, subjectId } = await params;
  const { success } = await searchParams;

  // 1. Ambil Info Mapel & Kelas
  const { data: subject } = await supabase.from("subjects").select("name, kkm").eq("id", subjectId).single();
  const { data: kelas } = await supabase.from("classes").select("name").eq("id", classId).single();

  // 2. Ambil Daftar Siswa
  const { data: students } = await supabase
    .from("students")
    .select("id, nis, profiles(full_name)")
    .eq("current_class_id", classId)
    .order("nis", { ascending: true });

  // 3. Ambil Nilai Existing
  const { data: existingGrades } = await supabase
    .from("grades")
    .select("*")
    .eq("subject_id", subjectId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/guru/nilai"
            className="p-2 rounded-full hover:bg-slate-200 transition"
          >
            <ArrowLeft className="h-6 w-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{subject?.name}</h1>
            <p className="text-slate-500">Input Nilai Kelas {kelas?.name}</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-bold text-sm">
          KKM: {subject?.kkm || 75}
        </div>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          ✅ {success}
        </div>
      )}

      {/* FORM INPUT */}
      <form action={saveGrades as any} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        <input type="hidden" name="classId" value={classId} />
        <input type="hidden" name="subjectId" value={subjectId} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-12">No</th>
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-4 py-4 w-32 text-center">Tugas (30%)</th>
                <th className="px-4 py-4 w-32 text-center">UTS (30%)</th>
                <th className="px-4 py-4 w-32 text-center">UAS (40%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* PERBAIKAN DI SINI: Tambahkan ': any' agar TypeScript tidak rewel */}
              {students?.map((student: any, index) => {
                const grade = existingGrades?.find((g) => g.student_id === student.id);
                
                // Logic Aman untuk mengambil Nama (cek Array atau Object)
                const profileData = student.profiles;
                const fullName = Array.isArray(profileData) 
                    ? profileData[0]?.full_name 
                    : profileData?.full_name;

                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-center text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {fullName || "Tanpa Nama"}
                      </div>
                      <div className="text-xs text-slate-400">NIS: {student.nis}</div>
                      <input type="hidden" name="student_ids[]" value={student.id} />
                    </td>
                    
                    <td className="px-4 py-4">
                      <input 
                        name="tugas[]"
                        type="number" 
                        min="0" max="100"
                        defaultValue={grade?.tugas || 0}
                        className="w-full text-center border border-slate-300 rounded-md py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        name="uts[]"
                        type="number" 
                        min="0" max="100"
                        defaultValue={grade?.uts || 0}
                        className="w-full text-center border border-slate-300 rounded-md py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        name="uas[]"
                        type="number" 
                        min="0" max="100"
                        defaultValue={grade?.uas || 0}
                        className="w-full text-center border border-slate-300 rounded-md py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </td>
                  </tr>
                );
              })}

              {(!students || students.length === 0) && (
                <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Belum ada siswa di kelas ini.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button 
            suppressHydrationWarning
            type="submit" 
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            <Save className="h-4 w-4" />
            Simpan Semua Nilai
          </button>
        </div>
      </form>
    </div>
  );
}