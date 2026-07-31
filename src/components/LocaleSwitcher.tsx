'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { locales, type Locale } from '@/i18n/config'

type Props = {
  locale: Locale
}

export function LocaleSwitcher({ locale }: Props) {
  const pathname = usePathname()

  return (
    <div className="locale-switcher" aria-label="Language">
      {locales.map((code, index) => {
        const segments = pathname.split('/')
        segments[1] = code
        const href = segments.join('/') || `/${code}`

        return (
          <span key={code}>
            {index > 0 ? <span className="locale-switcher__sep" aria-hidden>/</span> : null}
            <Link
              href={href}
              className={code === locale ? 'locale-switcher__active' : undefined}
              hrefLang={code}
              aria-current={code === locale ? 'page' : undefined}
            >
              {code.toUpperCase()}
            </Link>
          </span>
        )
      })}
    </div>
  )
}
