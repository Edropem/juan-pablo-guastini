import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/MediaImage'
import { PageMotion } from '@/components/PageMotion'
import { Reveal } from '@/components/Reveal'
import { RichText } from '@/components/RichText'
import { getDictionary } from '@/i18n/getDictionary'
import { isLocale, type Locale } from '@/i18n/config'
import { getAbout } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = getDictionary(localeParam)
  const about = await getAbout(localeParam)
  return buildMetadata({
    title: about.headline || dictionary.about.title,
    locale: localeParam,
    path: '/about',
  })
}

export default async function AboutPage({ params }: Props) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const dictionary = getDictionary(locale)
  const about = await getAbout(locale)
  const hasContent = Boolean(about.bio || about.headline || about.portrait || about.credits)

  return (
    <PageMotion>
      <Reveal>
        <h1 className="page-title">{about.headline || dictionary.about.title}</h1>
      </Reveal>

      {!hasContent ? <p className="empty-state">{dictionary.about.empty}</p> : null}

      <div className="about-layout">
        <Reveal delay={0.1}>
          <div>
            <RichText data={about.bio as DefaultTypedEditorState | null | undefined} />
            {about.credits ? <p className="about-layout__credits">{about.credits}</p> : null}
          </div>
        </Reveal>
        {about.portrait && typeof about.portrait === 'object' ? (
          <Reveal delay={0.2}>
            <div className="about-layout__portrait">
              <MediaImage media={about.portrait} sizes="(max-width: 900px) 100vw, 40vw" />
            </div>
          </Reveal>
        ) : null}
      </div>
    </PageMotion>
  )
}
