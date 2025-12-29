'use client'

import Swal from 'sweetalert2'
import { Trash2 } from 'lucide-react'
import { deleteTeacher } from '@/app/dashboard/admin/guru/actions' // Import action tadi

export default function DeleteButton({ id, nama }: { id: string, nama: string }) {
  
  const handleDelete = async () => {
    // 1. Tampilkan Pop-up Konfirmasi
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Anda akan menghapus guru: ${nama}. Data tidak bisa dikembalikan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    // 2. Jika user klik "Ya, Hapus!"
    if (result.isConfirmed) {
      // Panggil Server Action
      const res = await deleteTeacher(id)

      if (res.success) {
        // Pop-up Sukses
        Swal.fire({
          title: 'Terhapus!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        // Pop-up Gagal
        Swal.fire({
          title: 'Gagal!',
          text: res.message,
          icon: 'error'
        })
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      suppressHydrationWarning
      className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition"
    >
      <Trash2 className="h-3 w-3" />
      Hapus
    </button>
  )
}