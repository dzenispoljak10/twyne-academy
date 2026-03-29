export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto max-w-3xl px-6 prose">
        <h1>{locale === 'en' ? 'Privacy Policy' : locale === 'fr' ? 'Politique de confidentialité' : 'Datenschutzerklärung'}</h1>
        <p className="text-neutral-500">
          {locale === 'en'
            ? 'Privacy policy content will be added here.'
            : 'Datenschutzerklärung wird hier eingefügt.'}
        </p>
      </div>
    </div>
  )
}
