'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteClass(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id");

  if (!id) return;

  try {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) throw error;
    
    revalidatePath("/dashboard/admin/akademik/kelas");
  } catch (error) {
    console.error("Gagal menghapus kelas:", error);
  }
}