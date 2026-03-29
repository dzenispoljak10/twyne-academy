import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default async function KaufErfolgPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="h-20 w-20 text-success mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold mb-2">
          {locale === 'en' ? 'Thank you!' : 'Vielen Dank!'}
        </h1>
        <p className="text-neutral-500 mb-8">
          {locale === 'en'
            ? 'Your purchase was successful. You can now start your course.'
            : 'Dein Kauf war erfolgreich. Du kannst jetzt mit deinem Kurs beginnen.'}
        </p>
        <Button asChild>
          <Link href={`/${locale}/dashboard`}>
            {locale === 'en' ? 'Go to dashboard' : 'Zum Dashboard'}
          </Link>
        </Button>
      </div>
    </div>
  )
}
