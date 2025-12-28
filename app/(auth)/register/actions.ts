'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  // 1. Persiapan Client
  const supabaseAdmin = createAdminClient() // Untuk create user (bypass RLS)
  const supabase = await createClient() // Untuk login session

  // 2. Ambil Data Form
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Validasi sederhana
  if (password.length < 6) {
    return redirect('/register?error=Password minimal 6 karakter')
  }

  console.log("👉 Registering:", email)

  // 3. Buat User Auth (Pakai Admin)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto confirm
    user_metadata: {
        full_name: fullName,
        role: 'siswa' // KUNCI: Role Siswa
    }
  })

  if (authError) {
    console.error("❌ Gagal Auth:", authError.message)
    if (authError.message.includes("registered")) {
        return redirect('/login?error=Email sudah terdaftar. Silakan login.')
    }
    return redirect(`/register?error=${authError.message}`)
  }

  const newUserId = authData.user.id

  // 4. Buat Profile (Pakai Admin)
  await supabaseAdmin.from('profiles').upsert({
      id: newUserId,
      email: email,
      full_name: fullName,
      role: 'siswa'
  })

  // 5. Buat Data Siswa Draft (Pakai Admin)
  const tempNIS = Math.floor(1000 + Math.random() * 9000).toString()
  await supabaseAdmin.from('students').insert({
      id: newUserId,
      status: 'active',
      nis: tempNIS
  })

  // 6. Login Otomatis (Supaya user langsung masuk dashboard)
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (loginError) {
     return redirect('/login?error=Pendaftaran sukses, silakan login manual.')
  }

  // 7. Selesai
  revalidatePath('/', 'layout')
  redirect('/dashboard/siswa')
}