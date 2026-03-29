import type { Metadata } from 'next'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'
import { getMessages } from 'next-intl/server'
import { auth } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/layout/Providers'
import '../globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    de: 'Twyne Academy — Professionelle Online-Kurse',
    en: 'Twyne Academy — Professional Online Courses',
    fr: 'Twyne Academy — Cours en ligne professionnels',
  }
  return {
    title: { default: titles[locale] ?? titles.de, template: '%s | Twyne Academy' },
    description:
      locale === 'en'
        ? 'Professional online courses with recognized certificates.'
        : locale === 'fr'
        ? 'Cours en ligne professionnels avec des certificats reconnus.'
        : 'Professionelle Online-Kurse mit anerkannten Twyne Academy Zertifikaten.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://twyneacademy.com'),
    alternates: {
      languages: {
        de: '/de',
        en: '/en',
        fr: '/fr',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${sora.variable} ${plusJakarta.variable}`}>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar
              locale={locale}
              session={session as Parameters<typeof Navbar>[0]['session']}
              messages={messages as Record<string, Record<string, string>>}
            />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} messages={messages as Record<string, Record<string, string>>} />
          </div>
        </Providers>
      </body>
    </html>
  )
}
