import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'en' ? 'Pricing' : locale === 'fr' ? 'Tarifs' : 'Preise' }
}

export default async function PreisePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'preise' })

  const plans = [
    {
      id: 'free',
      name: t('free_name'),
      price: null,
      period: null,
      desc: t('free_desc'),
      features: [
        locale === 'en' ? 'Selected free courses' : 'Ausgewählte Free-Kurse',
        locale === 'en' ? 'Certificates for free courses' : 'Zertifikate für Free-Kurse',
        locale === 'en' ? 'No expiry date' : 'Kein Ablaufdatum',
        locale === 'en' ? 'Community access' : 'Community-Zugang',
      ],
      cta: t('jetzt_starten'),
      href: `/${locale}/registrieren`,
      highlighted: false,
    },
    {
      id: 'abo',
      name: t('abo_name'),
      price: 'CHF 29',
      period: t('pro_monat'),
      desc: t('abo_desc'),
      features: [
        locale === 'en' ? 'All courses' : 'Alle Kurse',
        locale === 'en' ? 'All certificates' : 'Alle Zertifikate',
        locale === 'en' ? 'New courses automatically' : 'Neue Kurse automatisch',
        locale === 'en' ? 'Priority support' : 'Priorität-Support',
        locale === 'en' ? 'Cancel anytime' : 'Jederzeit kündbar',
      ],
      cta: t('abo_starten'),
      href: `/${locale}/registrieren`,
      highlighted: true,
    },
    {
      id: 'einzel',
      name: t('einzel_name'),
      price: locale === 'en' ? 'from CHF 49' : 'ab CHF 49',
      period: t('pro_kurs'),
      desc: t('einzel_desc'),
      features: [
        locale === 'en' ? 'Per course' : 'Pro Kurs',
        locale === 'en' ? 'Lifetime access' : 'Lebenslanger Zugang',
        locale === 'en' ? 'Certificate' : 'Zertifikat',
        locale === 'en' ? 'All lesson types' : 'Alle Lektionstypen',
      ],
      cta: t('kurs_kaufen'),
      href: `/${locale}/kurse`,
      highlighted: false,
    },
  ]

  return (
    <div className="py-16 bg-neutral-50 min-h-screen">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-neutral-900 mb-3">{t('title')}</h1>
          <p className="text-neutral-500 text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col relative ${plan.highlighted ? 'border-2 border-primary shadow-xl' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="primary">{t('beliebt')}</Badge>
                </div>
              )}
              <div className="mb-6">
                <h2 className="font-display font-bold text-xl mb-1">{plan.name}</h2>
                <p className="text-sm text-neutral-500 mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-neutral-900">
                    {plan.price ?? 'Free'}
                  </span>
                  {plan.period && <span className="text-neutral-400 text-sm mb-1">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-600">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button variant={plan.highlighted ? 'primary' : 'secondary'} className="w-full" asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-neutral-400 mt-8">{t('probe')}</p>
      </div>
    </div>
  )
}
