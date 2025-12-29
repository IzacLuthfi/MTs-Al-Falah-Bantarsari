'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createTeacher(formData: FormData) {
  // 1. Cek Service Key (Wajib untuk Admin Actions)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error("❌ ERROR: Service Key hilang. Cek .env.local")
    return redirect('/dashboard/admin/guru/tambah?error=Server Error: Konfigurasi Key hilang')
  }

  // 2. Cek User Login (Hanya Admin yang boleh akses)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // 3. Ambil Data Form
  const fullName = formData.get('fullName') as string
  const nip = formData.get('nip') as string
  const education = formData.get('education') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validasi Input Kosong
  if (!email || !password || !nip || !fullName) {
    return redirect('/dashboard/admin/guru/tambah?error=Semua kolom wajib diisi')
  }

  // 4. Inisialisasi Admin Client (Mode Dewa)
  const supabaseAdmin = createAdminClient()

  // 5. Buat Akun Login (Auth)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'guru' }
  })

  // HANDLE ERROR: Jika Email Sudah Ada
  if (authError) {
    console.error('❌ Gagal Buat Akun:', authError.message)
    return redirect(`/dashboard/admin/guru/tambah?error=Gagal: ${authError.message}`)
  }

  const newUserId = authData.user?.id
  if (!newUserId) {
    return redirect('/dashboard/admin/guru/tambah?error=Gagal mendapatkan ID User baru')
  }

  // 6. UPDATE PROFILE (Tabel profiles)
  // Kita update profile yang otomatis dibuat oleh Trigger (jika ada trigger), 
  // atau buat baru jika belum ada.
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({ 
      id: newUserId,
      email: email,
      full_name: fullName,
      role: 'guru'
    })
  
  if (profileError) {
    console.error("❌ Gagal Profile:", profileError.message)
    // ROLLBACK: Hapus user auth jika profile gagal
    await supabaseAdmin.auth.admin.deleteUser(newUserId)
    return redirect('/dashboard/admin/guru/tambah?error=Gagal menyimpan profil')
  }

  // 7. SIMPAN DATA DETAIL GURU (Tabel teachers)
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
    
    // ROLLBACK PENTING: Hapus User Auth agar tidak jadi Data Hantu
    await supabaseAdmin.auth.admin.deleteUser(newUserId)

    // Cek pesan error spesifik (misal NIP kembar)
    if (dbError.message.includes("duplicate key") || dbError.message.includes("unique constraint")) {
        return redirect('/dashboard/admin/guru/tambah?error=Gagal: NIP sudah terdaftar pada guru lain')
    }

    return redirect(`/dashboard/admin/guru/tambah?error=Database Error: ${dbError.message}`)
  }

  // 8. SUKSES
  // Karena ini Form "Tambah", kita redirect balik ke list.
  // Note: Ini akan memunculkan Banner Hijau di list guru (karena ada ?success=...)
  revalidatePath('/dashboard/admin/guru')
  redirect('/dashboard/admin/guru?success=Guru berhasil ditambahkan')
}