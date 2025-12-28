import { createClient } from "@/utils/supabase/server";
import PrintButton from "@/components/PrintButton";
import { Users, GraduationCap, School } from "lucide-react";

export default async function LaporanPage() {
  const supabase = await createClient();

  // 1. Ambil Data Siswa beserta Kelasnya
  const { data: students } = await supabase
    .from("students")
    .select("status, classes(name)");

  // 2. Ambil Data Guru
  const { count: teacherCount } = await supabase
    .from("teachers")
    .select("*", { count: 'exact', head: true });

  // 3. Logic: Hitung Statistik
  const totalSiswa = students?.length || 0;
  const siswaAktif = students?.filter(s => s.status === 'active').length || 0;
  
  // Logic: Hitung Siswa per Kelas (Grouping)
  // Hasilnya akan seperti: { "7A": 30, "7B": 28, ... }
  const classDistribution: Record<string, number> = {};
  
  students?.forEach((s: any) => {
    const className = s.classes?.name || "Belum Masuk Kelas";
    if (classDistribution[className]) {
      classDistribution[className]++;
    } else {
      classDistribution[className] = 1;
    }
  });

  // Urutkan nama kelas biar rapi (7A, 7B, 8A...)
  const sortedClasses = Object.keys(classDistribution).sort();

  // Ambil Tanggal Hari Ini
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header Laporan */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Laporan Statistik Sekolah</h1>
          <p className="text-slate-500 mt-1">MTs Al Falah Bantarsari</p>
          <p className="text-sm text-slate-400 mt-1">Dicetak pada: {today}</p>
        </div>
        
        {/* Tombol Print (Akan hilang saat dikertas) */}
        <div>
          <PrintButton />
        </div>
      </div>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-700">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Siswa</p>
              <p className="text-3xl font-bold text-slate-800">{totalSiswa}</p>
              <p className="text-xs text-slate-500">{siswaAktif} Aktif</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-700">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Total Guru</p>
              <p className="text-3xl font-bold text-slate-800">{teacherCount || 0}</p>
              <p className="text-xs text-slate-500">Tenaga Pengajar</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-orange-50 rounded-xl border border-orange-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-700">
              <School className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Jumlah Rombel</p>
              <p className="text-3xl font-bold text-slate-800">{sortedClasses.length}</p>
              <p className="text-xs text-slate-500">Kelas Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Detail Per Kelas */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Distribusi Siswa Per Kelas</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-semibold">Nama Kelas</th>
              <th className="px-6 py-3 font-semibold">Jumlah Siswa</th>
              <th className="px-6 py-3 font-semibold">Persentase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedClasses.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-slate-500">Belum ada data pembagian kelas.</td>
              </tr>
            ) : (
              sortedClasses.map((className) => {
                const count = classDistribution[className];
                const percentage = totalSiswa > 0 ? ((count / totalSiswa) * 100).toFixed(1) : "0";
                
                return (
                  <tr key={className} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">Kelas {className}</td>
                    <td className="px-6 py-3 text-slate-600">{count} Siswa</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Tanda Tangan (Hanya muncul kalau banyak kertas, buat gaya laporan resmi) */}
      <div className="mt-12 pt-8 flex justify-end">
        <div className="text-center w-64">
          <p className="text-sm text-slate-600 mb-20">Bantarsari, {today}</p>
          <p className="font-bold text-slate-900 border-b border-slate-900 pb-1">Kepala Sekolah</p>
          <p className="text-xs text-slate-500 mt-1">NIP. ...........................</p>
        </div>
      </div>
    </div>
  );
}