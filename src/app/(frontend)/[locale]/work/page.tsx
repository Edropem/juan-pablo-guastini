import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageMotion } from '@/components/PageMotion'
import { ProjectList } from '@/components/ProjectList'
import { getDictionary } from '@/i18n/getDictionary'
import { isLocale, type Locale } from '@/i18n/config'
import { getProjects } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = getDictionary(localeParam)
  return buildMetadata({
    title: dictionary.work.title,
    locale: localeParam,
    path: '/work',
  })
}

export default async function WorkPage({ params }: Props) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const dictionary = getDictionary(locale)
  const projects = await getProjects(locale)

  return (
    <PageMotion>
      <h1 className="page-title">{dictionary.work.title}</h1>
      <ProjectList projects={projects} locale={locale} emptyLabel={dictionary.work.empty} />
    </PageMotion>
  )
}
