import { createClient } from "@/utils/supabase/server";
import { BookOpen, Award, FileText, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function NilaiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Ambil Data Nilai Siswa (Join ke Mapel untuk dapat nama pelajaran)
  const { data: grades } = await supabase
    .from("grades")
    .select(`
      *,
      subjects (name, kkm, code)
    `)
    .eq("student_id", user.id)
    .eq("semester", "Ganjil") // Filter semester aktif (bisa didinamiskan nanti)
    .order("subject_id", { ascending: true });

  // Helper function untuk hitung nilai akhir
  // Rumus: 30% Tugas + 30% UTS + 40% UAS
  const calculateFinalScore = (tugas: number, uts: number, uas: number) => {
    return (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
  };

  // Helper untuk predikat (A, B, C, D)
  const getPredikat = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Laporan Hasil Belajar</h1>
            <p className="text-orange-100 text-sm">Semester Ganjil • Tahun Ajaran 2024/2025</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            Transkrip Nilai
          </h3>
          <span className="text-xs text-slate-500 italic">*Nilai Akhir = 30% Tugas + 30% UTS + 40% UAS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white text-xs font-bold uppercase text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Mata Pelajaran</th>
                <th className="px-6 py-3 text-center">KKM</th>
                <th className="px-6 py-3 text-center">Tugas</th>
                <th className="px-6 py-3 text-center">UTS</th>
                <th className="px-6 py-3 text-center">UAS</th>
                <th className="px-6 py-3 text-center bg-slate-50 font-bold text-slate-700">Nilai Akhir</th>
                <th className="px-6 py-3 text-center">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!grades || grades.length === 0) ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="h-8 w-8 text-slate-300" />
                      <p>Belum ada data nilai yang diinput guru.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                grades.map((item: any) => {
                  const finalScore = calculateFinalScore(item.tugas, item.uts, item.uas);
                  const predikat = getPredikat(finalScore);
                  const isLulus = finalScore >= (item.subjects?.kkm || 75);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {item.subjects?.name || "Mapel Dihapus"}
                        <div className="text-xs text-slate-400 font-normal">{item.subjects?.code}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-slate-500">
                        {item.subjects?.kkm || 75}
                      </td>
                      <td className="px-6 py-4 text-center">{item.tugas}</td>
                      <td className="px-6 py-4 text-center">{item.uts}</td>
                      <td className="px-6 py-4 text-center">{item.uas}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-800 bg-slate-50">
                        {finalScore.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          isLulus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {predikat}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}