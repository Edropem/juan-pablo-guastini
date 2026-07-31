import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

  return (
    <PageMotion>
      <section className="hero">
        <h1 className="hero__brand">{siteSettings.siteName || 'Juan Pablo Guastini'}</h1>
        {home.headline ? <p className="hero__headline">{home.headline}</p> : null}
        {home.subhead || home.intro ? (
          <p className="hero__subhead">{home.subhead || home.intro}</p>
        ) : null}
        <Link href={`/${locale}/work`} className="hero__cta">
          {home.ctaLabel || dictionary.home.cta}
        </Link>
      </section>

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
