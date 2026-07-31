import Link from 'next/link'

import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import type { Dictionary } from '@/i18n/getDictionary'
import type { Locale } from '@/i18n/config'

type Props = {
  locale: Locale
  siteName: string
  dictionary: Dictionary
}

export function Header({ locale, siteName, dictionary }: Props) {
  const base = `/${locale}`

  return (
    <header className="site-header">
      <Link href={base} className="site-header__brand">
        {siteName}
      </Link>
      <nav className="site-header__nav" aria-label="Primary">
        <Link href={`${base}/work`}>{dictionary.nav.work}</Link>
        <Link href={`${base}/about`}>{dictionary.nav.about}</Link>
        <Link href={`${base}/contact`}>{dictionary.nav.contact}</Link>
        <LocaleSwitcher locale={locale} />
      </nav>
    </header>
  )
}
