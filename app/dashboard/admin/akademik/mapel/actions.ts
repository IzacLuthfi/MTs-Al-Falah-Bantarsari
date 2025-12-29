'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteSubject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id");

  if (!id) return;

  try {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) throw error;
    
    // Refresh halaman setelah hapus
    revalidatePath("/dashboard/admin/akademik/mapel");
  } catch (error) {
    console.error("Gagal menghapus mapel:", error);
  }
}