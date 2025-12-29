'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

// HAPUS import { redirect } from 'next/navigation' <-- Hapus ini jika tidak dipakai fungsi lain

export async function deleteTeacher(id: string) {
  // Validasi ID
  if (!id) return { success: false, message: "ID tidak valid" }

  const supabaseAdmin = createAdminClient()

  // 1. Coba Hapus User Auth
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (error) {
    console.error("Gagal menghapus user:", error.message)

    // LOGIC DATA HANTU: Jika user auth tidak ada, bersihkan data di tabel
    if (error.message.includes("User not found")) {
        try {
            await supabaseAdmin.from('teachers').delete().eq('id', id)
            await supabaseAdmin.from('profiles').delete().eq('id', id)
            
            revalidatePath('/dashboard/admin/guru')
            return { success: true, message: "Data hantu berhasil dibersihkan." }
        } catch (err) {
            return { success: false, message: "Gagal membersihkan data hantu." }
        }
    }

    return { success: false, message: error.message }
  }

  // 2. SUKSES
  // PENTING: Jangan pakai redirect() disini. Cukup revalidatePath saja.
  revalidatePath('/dashboard/admin/guru')
  
  return { success: true, message: "Data guru berhasil dihapus permanen." }
}