import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContactForm } from '@/components/ContactForm'
import { PageMotion } from '@/components/PageMotion'
import { Reveal } from '@/components/Reveal'
import { getDictionary } from '@/i18n/getDictionary'
import { isLocale, type Locale } from '@/i18n/config'
import { getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) return {}
  const dictionary = getDictionary(localeParam)
  return buildMetadata({
    title: dictionary.contact.title,
    description: dictionary.contact.intro,
    locale: localeParam,
    path: '/contact',
  })
}

export default async function ContactPage({ params }: Props) {
  const { locale: localeParam } = await params
  if (!isLocale(localeParam)) notFound()
  const locale = localeParam as Locale

  const dictionary = getDictionary(locale)
  const siteSettings = await getSiteSettings(locale)
  const socials = siteSettings.socialLinks ?? []

  return (
    <PageMotion>
      <Reveal>
        <h1 className="page-title">{dictionary.contact.title}</h1>
      </Reveal>
      <div className="contact-layout">
        <Reveal delay={0.1}>
          <div>
            <p className="contact-layout__intro">{dictionary.contact.intro}</p>
            {siteSettings.email ? (
              <p className="contact-layout__email">
                <strong>{dictionary.contact.emailLabel}</strong>
                <br />
                <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
              </p>
            ) : null}
            {socials.length > 0 ? (
              <div className="contact-layout__socials">
                <strong>{dictionary.contact.socials}</strong>
                <ul>
                  {socials.map((link, index) =>
                    link?.url && link?.label ? (
                      <li key={`${link.label}-${index}`}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <ContactForm dictionary={dictionary.contact} />
        </Reveal>
      </div>
    </PageMotion>
  )
}
