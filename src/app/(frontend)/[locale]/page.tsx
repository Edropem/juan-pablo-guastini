import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Hero } from '@/components/Hero'
import { Marquee } from '@/components/Marquee'
import { PageMotion } from '@/components/PageMotion'
import { ProjectList } from '@/components/ProjectList'
import { getDictionary } from '@/i18n/getDictionary'
import { isLocale, type Locale } from '@/i18n/config'
import { getFeaturedProjects, getHome, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}
  return buildMetadata({ locale: localeParam, path: '' })
}

function resolveCtaHref(ctaHref: string | null | undefined, locale: Locale): string {
  if (!ctaHref) return `/${locale}/work`
  if (/^https?:\/\//i.test(ctaHref)) return ctaHref
  if (ctaHref.startsWith('/')) {
    if (ctaHref === `/${locale}` || ctaHref.startsWith(`/${locale}/`)) return ctaHref
    return `/${locale}${ctaHref}`
  }
  return `/${locale}/${ctaHref}`
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const dictionary = getDictionary(locale)
  const [home, siteSettings, featured] = await Promise.all([
    getHome(locale),
    getSiteSettings(locale),
    getFeaturedProjects(locale),
  ])

  const siteName = siteSettings.siteName || 'Juan Pablo Guastini'
  const marqueeItems = [siteName, home.headline, dictionary.home.featured].filter(
    (item): item is string => Boolean(item),
  )

  return (
    <PageMotion>
      <Hero
        siteName={siteName}
        eyebrow={home.headline}
        subhead={home.subhead || home.intro}
        ctaLabel={home.ctaLabel || dictionary.home.cta}
        ctaHref={resolveCtaHref(home.ctaHref, locale)}
        heroImage={home.heroImage}
      />

      <Marquee items={marqueeItems} />

      <section className="section" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="section__label">
          {dictionary.home.featured}
        </h2>
        <ProjectList
          projects={featured}
          locale={locale}
          emptyLabel={dictionary.home.empty}
        />
      </section>
    </PageMotion>
  )
}
