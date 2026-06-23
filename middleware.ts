import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value

    // Simple token check (in real app use JWT or better auth)
    const expectedToken = process.env.ADMIN_TOKEN || 'dev-admin-token-2026'

    if (adminToken !== expectedToken) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
