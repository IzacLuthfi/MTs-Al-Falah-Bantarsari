'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin' // <--- PENTING: Import Admin
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- LOGIN (TETAP SAMA) ---
export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${error.message}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// --- REGISTER (PERBAIKAN: PAKAI ADMIN CLIENT) ---
export async function signup(formData: FormData) {
  // Gunakan Admin Client untuk bypass aturan RLS saat pendaftaran pertama
  const supabaseAdmin = createAdminClient()
  const supabase = await createClient() // Client biasa untuk login otomatis nanti

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Ambil nama dari email (contoh: ahmad@gmail.com -> ahmad)
  const generatedName = email.split('@')[0]

  console.log("👉 Mencoba mendaftar user:", email)

  // 1. Buat User Auth (Pakai Admin supaya bisa set confirm: true jika perlu)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Langsung confirm biar bisa login
    user_metadata: {
        full_name: generatedName,
        role: 'siswa'
    }
  })

  if (authError) {
    console.error("❌ Gagal Auth:", authError.message)
    // Jika user sudah ada, coba login saja atau kembalikan error
    if (authError.message.includes("registered")) {
        return redirect('/login?error=Email sudah terdaftar. Silakan login.')
    }
    return redirect(`/login?error=${authError.message}`)
  }

  const newUserId = authData.user.id
  console.log("✅ Auth Berhasil. ID:", newUserId)

  // 2. Buat Profile (Pakai Admin)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: newUserId,
      email: email,
      full_name: generatedName,
      role: 'siswa'
    })

  if (profileError) console.error("❌ Gagal Profile:", profileError.message)

  // 3. Buat Data Siswa Draft (Pakai Admin)
  // Buat NIS Sementara (Random 4 digit)
  const tempNIS = Math.floor(1000 + Math.random() * 9000).toString()

  const { error: studentError } = await supabaseAdmin
    .from('students')
    .insert({
      id: newUserId,
      status: 'active',
      nis: tempNIS
    })
  
  if (studentError) console.error("❌ Gagal Student:", studentError.message)

  // 4. Login Otomatis setelah daftar
  // Karena tadi kita pakai Admin untuk create, sesi login di browser belum ada.
  // Kita harus login manual di sisi server.
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (loginError) {
     return redirect('/login?error=Pendaftaran sukses, silakan login manual.')
  }

  console.log("✅ Berhasil Login Otomatis. Redirecting...")
  
  revalidatePath('/', 'layout')
  redirect('/dashboard/siswa')
}