'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createSubject(formData: FormData) {
  const supabase = await createClient()

  // Cek Login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // Ambil Data Form
  const name = formData.get('name') as string
  const code = formData.get('code') as string
  const kkm = formData.get('kkm') as string

  // Simpan ke Database (Tabel subjects)
  // Tidak perlu pakai Service Role Key karena ini data biasa
  const { error } = await supabase
    .from('subjects')
    .insert({
      name: name,
      code: code,
      kkm: parseInt(kkm)
    })

  if (error) {
    console.error("Gagal simpan mapel:", error)
    return redirect('/dashboard/admin/akademik/tambah?error=Gagal menyimpan data')
  }

  revalidatePath('/dashboard/admin/akademik')
  redirect('/dashboard/admin/akademik')
}