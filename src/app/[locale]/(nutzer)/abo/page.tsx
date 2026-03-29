import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Mein Abo' }

export default async function AboPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await auth()

  let subscription = null
  try {
    subscription = await prisma.subscription.findUnique({ where: { userId: session!.user.id } })
  } catch {
    //
  }

  return (
    <div className="py-10 min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-display font-bold mb-8">
          {locale === 'en' ? 'My Subscription' : 'Mein Abo'}
        </h1>

        {subscription ? (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-lg">{subscription.plan}</h2>
                <p className="text-sm text-neutral-500">
                  {locale === 'en' ? 'Renews on' : 'Verlängerung am'}: {formatDate(subscription.currentPeriodEnd, locale)}
                </p>
              </div>
              <Badge variant={subscription.status === 'ACTIVE' ? 'success' : 'warning'}>
                {subscription.status}
              </Badge>
            </div>

            {subscription.cancelAtEnd && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">
                {locale === 'en'
                  ? `Your subscription will end on ${formatDate(subscription.currentPeriodEnd, locale)}`
                  : `Dein Abo endet am ${formatDate(subscription.currentPeriodEnd, locale)}`}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary">
                {locale === 'en' ? 'Manage billing' : 'Abrechnung verwalten'}
              </Button>
              {!subscription.cancelAtEnd && (
                <Button variant="danger">
                  {locale === 'en' ? 'Cancel subscription' : 'Abo kündigen'}
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <p className="text-neutral-500 mb-4">
              {locale === 'en' ? 'No active subscription' : 'Kein aktives Abo'}
            </p>
            <Button asChild>
              <Link href={`/${locale}/preise`}>
                {locale === 'en' ? 'View plans' : 'Pläne ansehen'}
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
