import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/MediaImage'
import { PageMotion } from '@/components/PageMotion'
import { ProjectGallery } from '@/components/ProjectGallery'
import { RichText } from '@/components/RichText'
import { getDictionary } from '@/i18n/getDictionary'
import { isLocale, type Locale } from '@/i18n/config'
import { getProjectBySlug } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  if (!isLocale(localeParam)) return {}
  const locale = localeParam as Locale
  const project = await getProjectBySlug(slug, locale)
  if (!project) return {}

  return buildMetadata({
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.summary,
    locale,
    path: `/work/${slug}`,
  })
}

export default async function ProjectPage({ params }: Props) {
  const { locale: localeParam, slug } = await params
  if (!isLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const dictionary = getDictionary(locale)
  const project = await getProjectBySlug(slug, locale)
  if (!project) notFound()

  const disciplines =
    project.disciplines?.map((item) => item?.label).filter(Boolean).join(', ') || null

  return (
    <PageMotion>
      <Link href={`/${locale}/work`} className="back-link">
        ← {dictionary.work.back}
      </Link>

      <header className="project-detail__header">
        <h1 className="page-title">{project.title}</h1>
        <div className="project-detail__meta">
          {disciplines ? <span>{disciplines}</span> : null}
          {project.year ? <span>{project.year}</span> : null}
        </div>
      </header>

      {project.cover && typeof project.cover === 'object' ? (
        <div className="project-detail__cover">
          <MediaImage media={project.cover} priority sizes="100vw" />
        </div>
      ) : null}

      {project.summary ? <p className="project-detail__summary">{project.summary}</p> : null}

      <RichText data={project.body as DefaultTypedEditorState | null | undefined} />

      {project.gallery && project.gallery.length > 0 ? (
        <ProjectGallery
          gallery={project.gallery}
          closeLabel={dictionary.work.close}
          previousLabel={dictionary.work.previous}
          nextLabel={dictionary.work.next}
          openGalleryLabel={dictionary.work.openGallery}
        />
      ) : null}
    </PageMotion>
  )
}
