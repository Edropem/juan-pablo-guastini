import type { Metadata } from 'next'

import type { Locale } from '@/i18n/config'
import { getSiteSettings } from '@/lib/queries'

type SeoInput = {
  title?: string | null
  description?: string | null
  locale: Locale
  path?: string
}

export async function buildMetadata({
  title,
  description,
  locale,
  path = '',
}: SeoInput): Promise<Metadata> {
  const settings = await getSiteSettings(locale)
  const siteName = settings.siteName || 'Juan Pablo Guastini'
  const defaultTitle = settings.defaultSeo?.title || siteName
  const defaultDescription =
    settings.defaultSeo?.description ||
    'Art Director portfolio — Juan Pablo Guastini.'

  const pageTitle = title ? `${title} — ${siteName}` : defaultTitle

  return {
    title: pageTitle,
    description: description || defaultDescription,
    alternates: {
      languages: {
        en: `/en${path}`,
        es: `/es${path}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: description || defaultDescription,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      siteName,
      type: 'website',
    },
  }
}
