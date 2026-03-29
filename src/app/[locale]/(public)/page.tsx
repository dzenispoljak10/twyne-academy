import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { UserPlus, BookOpen, Award, CheckCircle, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      languages: { de: '/de', en: '/en', fr: '/fr' },
    },
  }
}

const placeholderCourses = [
  {
    id: '1',
    slug: 'seo-specialist',
    title: { de: 'SEO Specialist', en: 'SEO Specialist', fr: 'Spécialiste SEO' },
    shortDesc: {
      de: 'Lerne alle wichtigen SEO-Strategien für nachhaltige Rankings.',
      en: 'Learn all essential SEO strategies for sustainable rankings.',
      fr: 'Apprenez les stratégies SEO essentielles pour des classements durables.',
    },
    category: 'Marketing',
    level: 'Beginner',
    accessType: 'FREE',
    durationMin: 240,
  },
  {
    id: '2',
    slug: 'google-ads-profi',
    title: { de: 'Google Ads Profi', en: 'Google Ads Pro', fr: 'Google Ads Pro' },
    shortDesc: {
      de: 'Erstelle profitable Google Ads Kampagnen von Grund auf.',
      en: 'Create profitable Google Ads campaigns from scratch.',
      fr: 'Créez des campagnes Google Ads rentables depuis le début.',
    },
    category: 'Advertising',
    level: 'Intermediate',
    accessType: 'SUBSCRIPTION',
    durationMin: 360,
  },
  {
    id: '3',
    slug: 'social-media-marketing',
    title: { de: 'Social Media Marketing', en: 'Social Media Marketing', fr: 'Marketing sur les réseaux sociaux' },
    shortDesc: {
      de: 'Baue eine starke Social-Media-Präsenz für dein Unternehmen.',
      en: 'Build a strong social media presence for your business.',
      fr: 'Construisez une forte présence sur les réseaux sociaux pour votre entreprise.',
    },
    category: 'Social Media',
    level: 'Beginner',
    accessType: 'PAID',
    price: 4900,
    durationMin: 300,
  },
]

const steps = [
  {
    icon: UserPlus,
    titleDe: 'Konto erstellen',
    titleEn: 'Create account',
    titleFr: 'Créer un compte',
    descDe: 'Registriere dich kostenlos mit Google oder E-Mail.',
    descEn: 'Sign up for free with Google or email.',
    descFr: 'Inscrivez-vous gratuitement avec Google ou e-mail.',
  },
  {
    icon: BookOpen,
    titleDe: 'Kurs wählen & lernen',
    titleEn: 'Choose & learn',
    titleFr: 'Choisir & apprendre',
    descDe: 'Lerne in deinem eigenen Tempo mit Texten, Quizzes und mehr.',
    descEn: 'Learn at your own pace with texts, quizzes and more.',
    descFr: 'Apprenez à votre rythme avec des textes, des quiz et plus.',
  },
  {
    icon: Award,
    titleDe: 'Zertifikat erhalten',
    titleEn: 'Earn certificate',
    titleFr: 'Obtenir le certificat',
    descDe: 'Schliesse den Kurs ab und erhalte dein Twyne Academy Zertifikat.',
    descEn: 'Complete the course and receive your Twyne Academy certificate.',
    descFr: 'Terminez le cours et recevez votre certificat Twyne Academy.',
  },
]

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  const tKurs = await getTranslations({ locale, namespace: 'kurs' })
  const tPreise = await getTranslations({ locale, namespace: 'preise' })

  const getTitle = (obj: Record<string, string>) => obj[locale] ?? obj.de
  const lvlColor = (l: string) =>
    l === 'Beginner' ? 'success' : l === 'Intermediate' ? 'warning' : 'primary'

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-white py-20 md:py-28">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #185FA5 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="container relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <Badge variant="primary" className="mb-4">
                Twyne Academy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-neutral-900 leading-tight mb-6">
                {t('title')}
              </h1>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-lg">
                {t('subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href={`/${locale}/registrieren`}>
                    {t('cta_primary')} <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={`/${locale}/kurse`}>{t('cta_secondary')}</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-neutral-500">
                {['Kostenlos starten', 'Keine Kreditkarte', 'Jederzeit kündigen'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock certificate */}
            <div className="hidden md:block">
              <div className="relative mx-auto max-w-sm">
                <div className="bg-white rounded-2xl shadow-2xl border-4 border-primary p-8 animate-slideUp">
                  <div className="text-center">
                    <div className="text-primary font-display font-bold text-lg mb-1">
                      Twyne<span className="text-neutral-800">Academy</span>
                    </div>
                    <div className="w-12 h-0.5 bg-primary mx-auto mb-4" />
                    <p className="text-xs text-neutral-500 mb-2">Zertifikat der Vollendung</p>
                    <p className="font-display font-bold text-2xl text-neutral-900 mb-1">
                      Max Mustermann
                    </p>
                    <p className="text-xs text-neutral-400 mb-4">hat den Kurs erfolgreich abgeschlossen</p>
                    <p className="font-display font-semibold text-primary text-lg">
                      Twyne Academy SEO Specialist
                    </p>
                    <div className="mt-6 flex justify-between items-end text-xs text-neutral-400">
                      <span>März 2025</span>
                      <div className="text-right">
                        <div className="w-20 h-px bg-neutral-300 mb-1" />
                        <span>Twyne Academy</span>
                      </div>
                    </div>
                    <div className="mt-4 mx-auto w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-neutral-400">QR</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-xl p-3 shadow-lg">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">
              {locale === 'en' ? 'Featured Courses' : locale === 'fr' ? 'Cours populaires' : 'Beliebte Kurse'}
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              {locale === 'en'
                ? 'Start with our most popular courses and earn your certificate.'
                : locale === 'fr'
                ? 'Commencez par nos cours les plus populaires et obtenez votre certificat.'
                : 'Starte mit unseren beliebtesten Kursen und erhalte dein Zertifikat.'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {placeholderCourses.map((course) => (
              <Card key={course.id} hover className="flex flex-col">
                <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary-500" />
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="neutral">{course.category}</Badge>
                  <Badge variant={lvlColor(course.level) as 'success' | 'warning' | 'primary'}>
                    {course.level}
                  </Badge>
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">
                  {getTitle(course.title)}
                </h3>
                <p className="text-sm text-neutral-500 flex-1 leading-relaxed mb-4">
                  {getTitle(course.shortDesc)}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-sm font-semibold text-neutral-700">
                    {course.accessType === 'FREE'
                      ? tKurs('kostenlos')
                      : course.price
                      ? `CHF ${(course.price / 100).toFixed(2)}`
                      : 'Abo'}
                  </span>
                  <Button size="sm" asChild>
                    <Link href={`/${locale}/kurse/${course.slug}`}>
                      {tKurs('starten')}
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="secondary" size="lg" asChild>
              <Link href={`/${locale}/kurse`}>
                {tKurs('alle_kurse')} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">
              {locale === 'en' ? 'How it works' : locale === 'fr' ? 'Comment ça marche' : 'So funktioniert es'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              const title = locale === 'en' ? step.titleEn : locale === 'fr' ? step.titleFr : step.titleDe
              const desc = locale === 'en' ? step.descEn : locale === 'fr' ? step.descFr : step.descDe
              return (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl text-white mb-4 shadow-lg shadow-primary/30">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="font-bold text-primary text-sm mb-2">0{i + 1}</div>
                  <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">{title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-3">
              {tPreise('title')}
            </h2>
            <p className="text-neutral-500">{tPreise('subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: tPreise('free_name'),
                price: null,
                features: [
                  locale === 'en' ? 'Selected free courses' : 'Ausgewählte Free-Kurse',
                  locale === 'en' ? 'Certificates' : 'Zertifikate',
                  locale === 'en' ? 'No expiry' : 'Kein Ablaufdatum',
                ],
                cta: tPreise('jetzt_starten'),
                href: `/${locale}/registrieren`,
                highlighted: false,
              },
              {
                name: tPreise('abo_name'),
                price: 'CHF 29',
                period: tPreise('pro_monat'),
                features: [
                  locale === 'en' ? 'All courses' : 'Alle Kurse',
                  locale === 'en' ? 'All certificates' : 'Alle Zertifikate',
                  locale === 'en' ? 'New courses automatically' : 'Neue Kurse automatisch',
                ],
                cta: tPreise('abo_starten'),
                href: `/${locale}/preise`,
                highlighted: true,
              },
              {
                name: tPreise('einzel_name'),
                price: locale === 'en' ? 'from CHF 49' : 'ab CHF 49',
                period: tPreise('pro_kurs'),
                features: [
                  locale === 'en' ? 'Per course' : 'Pro Kurs',
                  locale === 'en' ? 'Lifetime access' : 'Lebenslanger Zugang',
                  locale === 'en' ? 'Certificate' : 'Zertifikat',
                ],
                cta: tPreise('kurs_kaufen'),
                href: `/${locale}/kurse`,
                highlighted: false,
              },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={plan.highlighted ? 'border-2 border-primary shadow-lg relative' : ''}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">{tPreise('beliebt')}</Badge>
                  </div>
                )}
                <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
                <div className="mb-4">
                  {plan.price ? (
                    <span className="text-3xl font-bold text-neutral-900">{plan.price}</span>
                  ) : (
                    <span className="text-3xl font-bold text-neutral-900">Free</span>
                  )}
                  {plan.period && (
                    <span className="text-neutral-400 text-sm ml-1">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-neutral-400 mt-6">{tPreise('probe')}</p>
          <div className="text-center mt-4">
            <Link href={`/${locale}/preise`} className="text-primary text-sm font-medium hover:underline">
              {locale === 'en' ? 'See full pricing details →' : 'Alle Details ansehen →'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {locale === 'en'
              ? 'Start your learning journey today'
              : locale === 'fr'
              ? 'Commencez votre parcours d\'apprentissage aujourd\'hui'
              : 'Starte deine Lernreise heute'}
          </h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto">
            {locale === 'en'
              ? 'Join thousands of learners and earn recognized certificates.'
              : locale === 'fr'
              ? 'Rejoignez des milliers d\'apprenants et obtenez des certificats reconnus.'
              : 'Schliesse dich tausenden Lernenden an und erhalte anerkannte Zertifikate.'}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="border-white text-white hover:bg-white hover:text-primary"
            asChild
          >
            <Link href={`/${locale}/registrieren`}>
              {t('cta_primary')} <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
