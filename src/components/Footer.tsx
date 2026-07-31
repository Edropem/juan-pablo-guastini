import type { Dictionary } from '@/i18n/getDictionary'
import type { SiteSetting } from '@/payload-types'

type Props = {
  siteSettings: SiteSetting
  dictionary: Dictionary
}

export function Footer({ siteSettings, dictionary }: Props) {
  const year = new Date().getFullYear()
  const socials = siteSettings.socialLinks ?? []

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <p className="site-footer__line">
          {siteSettings.footerLine || `${siteSettings.siteName}. ${dictionary.footer.rights}`}
        </p>
        {socials.length > 0 ? (
          <ul className="site-footer__socials">
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
        ) : null}
      </div>
      <p className="site-footer__copy">
        © {year} {siteSettings.siteName}
      </p>
    </footer>
  )
}
