'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Action Update Profil (Nama)
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  const fullName = formData.get("fullName") as string;
  
  // Ambil user yg sedang login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // Update ke tabel profiles
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) {
    return redirect("/dashboard/admin/settings?error=Gagal mengupdate profil");
  }

  revalidatePath("/dashboard/admin/settings");
  return redirect("/dashboard/admin/settings?success=Profil berhasil diperbarui");
}

// 2. Action Ganti Password
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validasi sederhana
  if (password !== confirmPassword) {
    return redirect("/dashboard/admin/settings?error=Password dan Konfirmasi tidak sama");
  }

  if (password.length < 6) {
    return redirect("/dashboard/admin/settings?error=Password minimal 6 karakter");
  }

  // Update Password di Auth Supabase
  const { error } = await supabase.auth.updateUser({ password: password });

  if (error) {
    return redirect("/dashboard/admin/settings?error=Gagal mengganti password");
  }

  return redirect("/dashboard/admin/settings?success=Password berhasil diganti");
}