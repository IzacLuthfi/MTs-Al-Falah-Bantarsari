import SidebarWali from "@/components/SidebarWali";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function WaliKelasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // KEAMANAN: Cek apakah user ini benar-benar Wali Kelas
  // (Meskipun role-nya 'guru', kita cek tabel classes)
  const { data: classAssignment } = await supabase
    .from("classes")
    .select("id")
    .eq("wali_id", user.id)
    .single();

  // Jika tidak punya kelas, tendang balik ke dashboard guru
  if (!classAssignment) {
    return redirect("/dashboard/guru");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarWali />
      <main className="md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}