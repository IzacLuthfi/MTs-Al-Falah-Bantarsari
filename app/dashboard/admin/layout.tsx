import SidebarAdmin from "@/components/SidebarAdmin"; // Pastikan import ini benar
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Cek Role Admin (Safety)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin" && profile?.role !== "admin_sekolah") {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <SidebarAdmin />
      <main className="md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}