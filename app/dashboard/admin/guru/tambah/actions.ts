'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createTeacher(formData: FormData) {
  // 1. Cek Service Key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error("❌ ERROR: Service Key hilang. Cek .env.local")
    return
  }

  // 2. Cek User Login
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // 3. Ambil Data Form
  const fullName = formData.get('fullName') as string
  const nip = formData.get('nip') as string
  const education = formData.get('education') as string
  
  // 4. Inisialisasi Admin Client
  const supabaseAdmin = createAdminClient()

  // 5. Buat Akun Login (Auth)
  // Email: nip@guru.mts.id | Password: guru[nip]
  const email = `${nip}@guru.mts.id`
  const password = `guru${nip}`

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'guru' }
  })

  // Handle jika user sudah ada (User already registered)
  if (authError && !authError.message.includes("registered")) {
    console.error('❌ Gagal Buat Akun:', authError.message)
    return 
  }

  // Ambil ID (Entah baru dibuat atau yang sudah ada)
  let newUserId = authData.user?.id
  
  // Jika user sudah ada, kita harus cari ID-nya manual lewat email
  if (!newUserId) {
     const { data: existingUser } = await supabaseAdmin.rpc('get_user_id_by_email', { email_input: email })
     // Catatan: RPC agak ribet, kita asumsi user baru dulu. 
     // Jika error "User already registered", biasanya admin harus hapus user lama dulu di Supabase Dashboard.
     console.error("⚠️ User sudah ada. Harap hapus user lama di dashboard jika ingin reset.")
     return
  }

  // 6. PAKSA BUAT PROFILE (Agar tidak error Foreign Key)
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({ 
      id: newUserId,
      email: email,
      full_name: fullName,
      role: 'guru'
    })
  
  if (profileError) console.error("❌ Gagal Profile:", profileError.message)

  // 7. Simpan Data Detail Guru
  const { error: dbError } = await supabaseAdmin
    .from('teachers')
    .insert({
      id: newUserId,
      nip: nip,
      education_level: education,
      is_active: true
    })

  if (dbError) {
    console.error('❌ Gagal Simpan Guru:', dbError.message)
    // Hapus auth jika gagal (Cleanup)
    await supabaseAdmin.auth.admin.deleteUser(newUserId)
    return 
  }

  // 8. Sukses
  revalidatePath('/dashboard/admin/guru')
  redirect('/dashboard/admin/guru')
}