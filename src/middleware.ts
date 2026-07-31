import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale, isLocale, locales } from '@/i18n/config'

function getPreferredLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language')
  if (!header) return defaultLocale

  const preferred = header
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase())
    .find((lang) => lang && locales.some((locale) => lang === locale || lang.startsWith(`${locale}-`)))

  if (!preferred) return defaultLocale

  const match = locales.find((locale) => preferred === locale || preferred.startsWith(`${locale}-`))
  return match ?? defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const segment = pathname.split('/')[1]

  if (isLocale(segment)) {
    return NextResponse.next()
  }

  const locale = getPreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
