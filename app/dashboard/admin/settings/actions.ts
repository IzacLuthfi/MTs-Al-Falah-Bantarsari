'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Logic Update Profil (Nama)
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const fullName = formData.get('fullName') as string

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) {
    return redirect('/dashboard/admin/settings?error=Gagal update profil')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard/admin/settings?success=Profil berhasil diupdate')
}

// 2. Logic Ganti Password
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return redirect('/dashboard/admin/settings?error=Password tidak cocok')
  }

  if (password.length < 6) {
    return redirect('/dashboard/admin/settings?error=Password minimal 6 karakter')
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return redirect(`/dashboard/admin/settings?error=${error.message}`)
  }

  redirect('/dashboard/admin/settings?success=Password berhasil diganti')
}