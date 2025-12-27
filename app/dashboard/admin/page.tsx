import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Users, GraduationCap, School, BookOpen } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Cek Security: Pastikan yang akses benar-benar Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin" && profile?.role !== "admin_sekolah") {
    return redirect("/dashboard"); // Tendang jika bukan admin
  }

  // --- UI Dashboard Admin ---
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Administrator</h1>
      
      {/* Kartu Ringkasan (Statistik) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Siswa" value="1,204" icon={<Users className="h-6 w-6 text-blue-600" />} />
        <StatCard title="Total Guru" value="45" icon={<GraduationCap className="h-6 w-6 text-green-600" />} />
        <StatCard title="Jumlah Kelas" value="24" icon={<School className="h-6 w-6 text-orange-600" />} />
        <StatCard title="Mata Pelajaran" value="18" icon={<BookOpen className="h-6 w-6 text-purple-600" />} />
      </div>

      {/* Area Konten Utama */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Aktivitas Terbaru</h2>
        <p className="text-slate-500">Belum ada aktivitas yang tercatat hari ini.</p>
      </div>
    </div>
  );
}

// Komponen Kecil untuk Kartu (Biar rapi)
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mr-4 rounded-full bg-slate-100 p-3">{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}