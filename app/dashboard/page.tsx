import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // 2. Cek Role User tersebut
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;

  // 3. Redirect sesuai Role
  // "Polisi Lalu Lintas" bekerja di sini
  if (role === "super_admin" || role === "admin_sekolah") {
    redirect("/dashboard/admin");
  } else if (role === "guru") {
    // YANG BENAR KE SINI:
    redirect("/dashboard/guru"); 
  } else if (role === "siswa") {
    redirect("/dashboard/siswa");
  } else if (role === "wali_kelas") {
    redirect("/dashboard/walikelas"); 
  }

  // 4. Fallback (Jika role tidak dikenali)
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Akses Ditolak</h1>
      <p>Role akun Anda ({role}) tidak memiliki dashboard yang aktif.</p>
      <form action="/auth/signout" method="post" className="mt-4">
        <button className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>
    </div>
  );
}