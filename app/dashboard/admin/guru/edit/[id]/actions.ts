'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateTeacher(formData: FormData) {
  // 1. Cek Service Key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return redirect('/dashboard/admin/guru?error=Server Config Error: Key Missing')
  }

  // 2. Cek Admin Login
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // 3. Ambil Data Form
  const id = formData.get('id') as string
  const fullName = formData.get('fullName') as string
  const nip = formData.get('nip') as string
  const email = formData.get('email') as string
  const education = formData.get('education') as string
  const statusString = formData.get('status') as string
  
  const isActive = statusString === 'true'

  if (!id || !fullName || !nip || !email) {
    return redirect(`/dashboard/admin/guru/edit/${id}?error=Data wajib tidak boleh kosong`)
  }

  // 4. Init Admin Client
  const supabaseAdmin = createAdminClient()

  // 5. UPDATE AUTH EMAIL (Login)
  // Hati-hati: Jika email duplikat, ini akan error
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
    email: email,
    email_confirm: true // Otomatis confirm biar gak perlu verifikasi lagi
  })

  if (authError) {
    console.error("Gagal update auth:", authError)
    return redirect(`/dashboard/admin/guru/edit/${id}?error=Gagal update Email: ${authError.message}`)
  }

  // 6. UPDATE PROFILE (Nama & Email Tampilan)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ 
        full_name: fullName,
        email: email
    })
    .eq('id', id)

  if (profileError) {
    console.error("Gagal update profile:", profileError)
    return redirect(`/dashboard/admin/guru/edit/${id}?error=Gagal update profil`)
  }

  // 7. UPDATE TEACHERS DATA (NIP, Pendidikan, Status)
  const { error: teacherError } = await supabaseAdmin
    .from('teachers')
    .update({ 
      nip: nip,
      education_level: education,
      is_active: isActive
    })
    .eq('id', id)

  if (teacherError) {
    console.error("Gagal update teacher:", teacherError)
    return redirect(`/dashboard/admin/guru/edit/${id}?error=Gagal update Data Guru`)
  }

  // 8. Sukses
  revalidatePath('/dashboard/admin/guru')
  redirect('/dashboard/admin/guru?success=Data guru berhasil diperbarui')
}