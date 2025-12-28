import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Fungsi Helper agar tidak menulis ulang kode
async function logout(req: NextRequest) {
  const supabase = await createClient()

  // Check user
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  
  // Redirect ke halaman login
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}

// 1. Tangani Request dari Tombol (Form Action)
export async function POST(req: NextRequest) {
  return logout(req)
}

// 2. Tangani Request dari Browser Address Bar (Ketik URL Manual)
export async function GET(req: NextRequest) {
  return logout(req)
}