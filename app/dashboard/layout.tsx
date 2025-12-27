import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cek login sekali lagi di level layout agar aman
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar (Kiri) */}
      <Sidebar />

      {/* Konten Utama (Kanan) */}
      {/* ml-64 artinya margin-left 64 (sesuai lebar sidebar) agar konten tidak tertutup */}
      <main className="md:ml-64 p-8">
        {/* Header Mobile (Opsional nanti ditambahkan) */}
        
        {children}
      </main>
    </div>
  );
}