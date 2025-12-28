import SidebarGuru from "@/components/SidebarGuru";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Opsional: Cek apakah benar role-nya guru
  // (Untuk keamanan ekstra, tapi login page sudah handle redirect sebenarnya)

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarGuru />
      <main className="md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}