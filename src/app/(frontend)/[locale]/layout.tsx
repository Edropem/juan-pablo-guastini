import { Space_Grotesk, Syne } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { CursorRing } from '@/components/CursorRing'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SmoothScroll } from '@/components/SmoothScroll'
import { getDictionary } from '@/i18n/getDictionary'
import { isLocale, type Locale } from '@/i18n/config'
import { getSiteSettings } from '@/lib/queries'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const dictionary = getDictionary(locale)
  const siteSettings = await getSiteSettings(locale)

  return (
    <html lang={locale} className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body>
        <SmoothScroll />
        <CursorRing />
        <div className="site-shell">
          <Header
            locale={locale}
            siteName={siteSettings.siteName || 'Juan Pablo Guastini'}
            dictionary={dictionary}
          />
          <main className="site-main">{children}</main>
          <Footer siteSettings={siteSettings} dictionary={dictionary} />
        </div>
      </body>
    </html>
  )
}
