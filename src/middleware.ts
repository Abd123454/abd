import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth', '/api/health']

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Allow public paths
  if (PUBLIC_PATHS.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow API routes (they handle their own auth)
  if (path.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check for session cookie
  const session = req.cookies.get('masari-session')?.value
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg).*)']
}
