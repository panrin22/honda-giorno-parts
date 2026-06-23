import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const correctPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (password === correctPassword) {
    const response = NextResponse.json({ success: true })

    // Set a simple token cookie (in production use proper JWT + httpOnly + secure)
    const token = process.env.ADMIN_TOKEN || 'dev-admin-token-2026'
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  }

  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
}
