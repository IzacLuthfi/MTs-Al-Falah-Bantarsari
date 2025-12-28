'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveGrades(formData: FormData) {
  const supabase = await createClient()

  // 1. Ambil Data Context (Mapel & Kelas mana?)
  const classId = formData.get('classId') as string
  const subjectId = formData.get('subjectId') as string
  
  // 2. Ambil Array Data Nilai
  // Di HTML nanti kita pakai input name="student_ids[]", "tugas[]", dll
  const studentIds = formData.getAll('student_ids')
  const tugasList = formData.getAll('tugas')
  const utsList = formData.getAll('uts')
  const uasList = formData.getAll('uas')

  const updates = studentIds.map((studentId, index) => ({
    student_id: studentId,
    subject_id: subjectId,
    semester: 'Ganjil', // Hardcode dulu, nanti bisa dinamis
    academic_year: '2024/2025',
    tugas: parseInt(tugasList[index] as string) || 0,
    uts: parseInt(utsList[index] as string) || 0,
    uas: parseInt(uasList[index] as string) || 0
  }))

  // 3. Simpan ke Database (Upsert: Insert kalau baru, Update kalau ada)
  // Kita loop satu per satu (atau bisa bulk upsert kalau conflict key sudah di set)
  // Untuk amannya kita loop dulu.
  
  for (const grade of updates) {
    // Cari dulu apakah sudah ada nilai buat siswa ini & mapel ini
    const { data: existing } = await supabase
        .from('grades')
        .select('id')
        .eq('student_id', grade.student_id)
        .eq('subject_id', grade.subject_id)
        .single()

    if (existing) {
        // UPDATE
        await supabase.from('grades').update(grade).eq('id', existing.id)
    } else {
        // INSERT
        await supabase.from('grades').insert(grade)
    }
  }

  // 4. Selesai
  revalidatePath(`/dashboard/guru/nilai/${classId}/${subjectId}`)
  redirect(`/dashboard/guru/nilai/${classId}/${subjectId}?success=Nilai berhasil disimpan`)
}