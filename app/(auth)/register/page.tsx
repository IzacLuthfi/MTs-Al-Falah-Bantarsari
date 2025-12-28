import Link from 'next/link'
import { signup } from './actions'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Pendaftaran Siswa</h1>
          <p className="text-sm text-slate-600">Buat akun baru untuk akses portal</p>
        </div>

        {/* Pesan Error */}
        {params.error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center text-sm text-red-600 font-medium">
            ⚠️ {params.error}
          </div>
        )}

        <form className="space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Nama Lengkap Siswa</label>
            <input
              suppressHydrationWarning={true}
              name="fullName"
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Aktif</label>
            <input
              suppressHydrationWarning={true}
              name="email"
              type="email"
              required
              placeholder="siswa@gmail.com"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              suppressHydrationWarning={true}
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2">
            <button
              suppressHydrationWarning={true}
              formAction={signup}
              className="w-full flex justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
            >
              Daftar Sekarang
            </button>
          </div>
        </form>

        {/* Link Balik ke Login */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}