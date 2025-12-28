import Link from 'next/link'     // <--- Jangan lupa import Link
import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">MTs Al Falah</h1>
          <p className="text-sm text-slate-600">Silakan login untuk masuk aplikasi</p>
        </div>

        {params.error && (
          <div className="rounded bg-red-50 p-3 text-center text-sm text-red-600 border border-red-200">
            {params.error}
          </div>
        )}

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              suppressHydrationWarning={true}
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              suppressHydrationWarning={true}
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <button
            suppressHydrationWarning={true}
            formAction={login}
            className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-all"
          >
            Masuk Aplikasi
          </button>
        </form>
        
        {/* Tombol Menuju Halaman Register Baru */}
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-slate-600 mb-3">Belum punya akun siswa?</p>
          <Link 
            href="/register" 
            className="inline-block w-full rounded-md border border-blue-600 text-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-all text-center"
          >
            Daftar Siswa Baru
          </Link>
        </div>

      </div>
    </div>
  )
}