import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        {/* Header Logo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">MTs Al Falah</h1>
          <p className="text-sm text-slate-600">Sistem Informasi Sekolah (PWA)</p>
        </div>

        {/* Pesan Error jika ada */}
        {searchParams.error && (
          <div className="rounded bg-red-100 p-3 text-center text-sm text-red-600">
            {searchParams.error}
          </div>
        )}

        {/* Form Login */}
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="admin@mtsalfalah.sch.id"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Tombol menggunakan Server Action */}
          <button
            formAction={login}
            className="w-full flex justify-center rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Masuk Aplikasi
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Lupa password? Hubungi Admin Sekolah.
        </p>
      </div>
    </div>
  )
}