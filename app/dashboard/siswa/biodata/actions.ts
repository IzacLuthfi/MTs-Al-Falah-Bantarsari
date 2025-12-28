'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateBiodata(formData: FormData) {
  const supabase = await createClient()

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // 2. Ambil Data dari Form
  const gender = formData.get('gender') as string
  const birthPlace = formData.get('birthPlace') as string
  const birthDate = formData.get('birthDate') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  
  // 3. Update ke Tabel Students
  const { error } = await supabase
    .from('students')
    .update({
      gender: gender,
      birth_place: birthPlace,
      birth_date: birthDate, // Format YYYY-MM-DD
      address: address,
      phone: phone
    })
    .eq('id', user.id)

  if (error) {
    console.error("Gagal update biodata:", error.message)
    return redirect('/dashboard/siswa/biodata?error=Gagal menyimpan data')
  }

  // 4. Sukses
  revalidatePath('/dashboard/siswa/biodata')
  redirect('/dashboard/siswa/biodata?success=Data berhasil diperbarui')
}