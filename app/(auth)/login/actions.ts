'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  // 👇 Perubahan: Tambahkan 'await' di sini
  const supabase = await createClient() 

  // ... sisa kode ke bawah SAMA SEPERTI SEBELUMNYA ...
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?error=Login gagal. Periksa email/password.')
  }

  const userId = data.user.id
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  const userRole = profile?.role || 'siswa'

  revalidatePath('/', 'layout')
  
  switch (userRole) {
    case 'super_admin':
    case 'admin_sekolah':
      redirect('/dashboard/admin') // Pastikan folder dashboard/admin nanti dibuat
      break
    case 'guru':
      redirect('/dashboard/guru')
      break
    case 'siswa':
      redirect('/dashboard/siswa')
      break
    default:
      redirect('/dashboard')
  }
}