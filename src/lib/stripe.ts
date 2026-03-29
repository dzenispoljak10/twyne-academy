import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia' as const,
  typescript: true,
})

export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const { prisma } = await import('./prisma')
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (user?.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({ email, metadata: { userId } })

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}
