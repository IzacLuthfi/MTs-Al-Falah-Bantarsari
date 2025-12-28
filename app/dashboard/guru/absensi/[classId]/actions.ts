'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveAttendance(formData: FormData) {
  const supabase = await createClient()

  const classId = formData.get('classId') as string
  const date = formData.get('date') as string // YYYY-MM-DD
  
  const studentIds = formData.getAll('student_ids')
  
  // Kita perlu ambil status masing-masing siswa.
  // Karena radio button name-nya beda per siswa (status_IDsiswa),
  // kita harus loop studentIds buat ambil value-nya.
  
  const updates = []

  for (const studentId of studentIds) {
      const status = formData.get(`status_${studentId}`) as string || 'Hadir'
      
      updates.push({
          class_id: classId,
          student_id: studentId,
          date: date,
          status: status
      })
  }

  // Simpan ke Database (Upsert agar tidak duplikat di tanggal sama)
  // onConflict: student_id, date
  const { error } = await supabase
    .from('attendance')
    .upsert(updates, { onConflict: 'student_id, date' })

  if (error) {
      console.error("Gagal absen:", error)
      return redirect(`/dashboard/guru/absensi/${classId}?error=Gagal menyimpan data`)
  }

  revalidatePath(`/dashboard/guru/absensi/${classId}`)
  redirect(`/dashboard/guru/absensi/${classId}?date=${date}&success=Absensi berhasil disimpan`)
}