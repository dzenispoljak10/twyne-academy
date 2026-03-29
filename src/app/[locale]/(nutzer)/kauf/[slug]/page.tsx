import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export default async function KaufPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  let course
  try {
    course = await prisma.course.findUnique({ where: { slug } })
  } catch {
    notFound()
  }
  if (!course) notFound()

  const getTitle = (t: unknown) => (t as Record<string, string>)[locale] ?? ''

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full">
        <Card>
          <h1 className="text-xl font-display font-bold mb-6">
            {locale === 'en' ? 'Purchase course' : 'Kurs kaufen'}
          </h1>
          <div className="border border-neutral-200 rounded-xl p-4 mb-6">
            <p className="font-semibold">{getTitle(course.title)}</p>
            <p className="text-2xl font-bold text-primary mt-2">
              {course.price ? formatPrice(course.price) : locale === 'en' ? 'Free' : 'Kostenlos'}
            </p>
          </div>
          <p className="text-sm text-neutral-500 mb-6">
            {locale === 'en'
              ? 'Stripe checkout will be configured once your API keys are set.'
              : 'Stripe-Checkout wird konfiguriert sobald deine API-Keys eingetragen sind.'}
          </p>
          <Button className="w-full" disabled>
            {locale === 'en' ? 'Proceed to payment' : 'Zur Zahlung'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
