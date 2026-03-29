import Link from 'next/link'

interface FooterProps {
  locale: string
  messages: Record<string, Record<string, string>>
}

export default function Footer({ locale, messages }: FooterProps) {
  const t = messages.footer ?? {}
  const year = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto">
      <div className="container mx-auto px-6 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-lg font-display mb-3">
              <span className="text-neutral-300">Twyne</span>
              <span className="text-primary">Academy</span>
            </div>
            <p className="text-sm leading-relaxed">
              Professionelle Online-Kurse mit anerkannten Zertifikaten.
            </p>
          </div>

          <div>
            <h4 className="text-neutral-300 font-semibold text-sm mb-3">{t.ueber ?? 'Über uns'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/kurse`} className="hover:text-neutral-200 transition-colors">{t.kurse ?? 'Kurse'}</Link></li>
              <li><Link href={`/${locale}/preise`} className="hover:text-neutral-200 transition-colors">{t.preise ?? 'Preise'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-neutral-300 font-semibold text-sm mb-3">{t.support ?? 'Support'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/login`} className="hover:text-neutral-200 transition-colors">{messages.nav?.login ?? 'Anmelden'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-neutral-300 font-semibold text-sm mb-3">{t.legal ?? 'Rechtliches'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/datenschutz`} className="hover:text-neutral-200 transition-colors">{t.datenschutz ?? 'Datenschutz'}</Link></li>
              <li><Link href={`/${locale}/impressum`} className="hover:text-neutral-200 transition-colors">{t.impressum ?? 'Impressum'}</Link></li>
              <li><Link href={`/${locale}/agb`} className="hover:text-neutral-200 transition-colors">{t.agb ?? 'AGB'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-6 text-sm text-center">
          {(t.copyright ?? '© {year} Twyne Academy. Alle Rechte vorbehalten.').replace('{year}', String(year))}
        </div>
      </div>
    </footer>
  )
}
