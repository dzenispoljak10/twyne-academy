export default async function AGBPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto max-w-3xl px-6 prose">
        <h1>{locale === 'en' ? 'Terms of Service' : locale === 'fr' ? 'CGU' : 'Allgemeine Geschäftsbedingungen'}</h1>
        <p className="text-neutral-500">
          {locale === 'en' ? 'Terms of service will be added here.' : 'AGB werden hier eingefügt.'}
        </p>
      </div>
    </div>
  )
}
