import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const courseId = session.metadata?.courseId

      if (session.mode === 'payment' && userId && courseId) {
        await prisma.purchase.create({
          data: {
            userId,
            courseId,
            stripePaymentId: session.payment_intent as string,
            amount: session.amount_total ?? 0,
            currency: session.currency ?? 'chf',
          },
        })
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {},
          create: { userId, courseId },
        })
      }

      if (session.mode === 'subscription' && userId) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeSubId: sub.id,
            status: 'ACTIVE',
            plan: sub.items.data[0]?.price.id ?? '',
            currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
          },
          create: {
            userId,
            stripeSubId: sub.id,
            stripeCustomerId: sub.customer as string,
            status: 'ACTIVE',
            plan: sub.items.data[0]?.price.id ?? '',
            currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
          },
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const statusMap: Record<string, string> = {
        active: 'ACTIVE',
        trialing: 'TRIALING',
        canceled: 'CANCELED',
        past_due: 'PAST_DUE',
        incomplete: 'INCOMPLETE',
      }
      await prisma.subscription.updateMany({
        where: { stripeSubId: sub.id },
        data: {
          status: (statusMap[sub.status] ?? 'INCOMPLETE') as 'ACTIVE' | 'TRIALING' | 'CANCELED' | 'PAST_DUE' | 'INCOMPLETE',
          currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
          cancelAtEnd: sub.cancel_at_period_end,
        },
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await prisma.subscription.updateMany({
        where: { stripeSubId: sub.id },
        data: { status: 'CANCELED' },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
