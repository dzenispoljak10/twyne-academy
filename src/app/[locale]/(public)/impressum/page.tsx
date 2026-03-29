export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto max-w-3xl px-6 prose">
        <h1>{locale === 'en' ? 'Imprint' : locale === 'fr' ? 'Mentions légales' : 'Impressum'}</h1>
        <p className="text-neutral-500">Twyne Academy<br />Schweiz</p>
      </div>
    </div>
  )
}
