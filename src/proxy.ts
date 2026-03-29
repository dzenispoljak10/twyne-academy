import createMiddleware from 'next-intl/middleware'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const locales = ['de', 'en', 'fr']
const defaultLocale = 'de'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

const PROTECTED_PATHS = [
  '/dashboard',
  '/profil',
  '/einstellungen',
  '/zertifikate',
  '/abo',
  '/lernen',
  '/kauf',
]

const ADMIN_PATHS = ['/admin']

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(de|en|fr)/, '') || '/'

  // Admin guard
  if (ADMIN_PATHS.some((p) => pathnameWithoutLocale.startsWith(p))) {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      const locale = pathname.split('/')[1] || defaultLocale
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
  }

  // Auth guard
  if (PROTECTED_PATHS.some((p) => pathnameWithoutLocale.startsWith(p))) {
    const session = await auth()
    if (!session) {
      const locale = pathname.split('/')[1] || defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)'],
}
