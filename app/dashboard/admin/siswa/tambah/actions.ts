'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createStudent(formData: FormData) {
  console.log("========================================")
  console.log("🚀 1. MEMULAI PROSES TAMBAH SISWA (FIXED)")
  
  // 1. Cek Service Key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error("❌ ERROR FATAL: SUPABASE_SERVICE_ROLE_KEY tidak terbaca!")
    return
  }

  // 2. Cek User Login (Keamanan)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login')
  }

  // 3. Ambil Data Form
  const fullName = formData.get('fullName') as string
  const nis = formData.get('nis') as string
  const nisn = formData.get('nisn') as string
  const classId = formData.get('classId') as string
  
  // 4. Inisialisasi Admin Client
  const supabaseAdmin = createAdminClient()

  // 5. Buat Akun Login (Auth)
  const email = `${nis}@siswa.mts.id`
  const password = `siswa${nis}`

  console.log("⏳ Sedang membuat akun Auth...")
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'siswa' }
  })

  if (authError) {
    console.error('❌ Gagal Buat Akun Login:', authError.message)
    if (!authError.message.includes("registered")) return 
  }

  const newUserId = authData.user?.id
  if (!newUserId) return

  console.log("✅ Akun Auth Terbuat. ID:", newUserId)

  // ---------------------------------------------------------
  // LANGKAH BARU: PAKSA BUAT PROFILE (SOLUSI FIX)
  // ---------------------------------------------------------
  console.log("⏳ Sedang membuat Profile manual...")
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({ 
      id: newUserId,
      email: email,
      full_name: fullName,
      role: 'siswa'
    })
  
  if (profileError) {
    console.error("❌ Gagal buat Profile:", profileError.message)
    // Jangan return dulu, coba lanjut siapa tahu profile sebenernya udah ada
  } else {
    console.log("✅ Profile berhasil dibuat/diupdate.")
  }
  // ---------------------------------------------------------

  // 6. Simpan Data Detail Siswa (Tabel Students)
  console.log("⏳ Sedang menyimpan ke tabel students...")
  const { error: dbError } = await supabaseAdmin
    .from('students')
    .insert({
      id: newUserId,
      nis: nis,
      nisn: nisn,
      current_class_id: parseInt(classId),
      status: 'active'
    })

  if (dbError) {
    console.error('❌ Gagal Simpan Database Siswa:', dbError.message)
    console.error('👉 Detail Error:', dbError)
    
    // Bersihkan user auth jika gagal total
    await supabaseAdmin.auth.admin.deleteUser(newUserId)
    return 
  }

  console.log("✅ BERHASIL MENYIMPAN DATA SISWA!")
  console.log("========================================")
  
  revalidatePath('/dashboard/admin/siswa')
  redirect('/dashboard/admin/siswa')
}