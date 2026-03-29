import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import Card from '@/components/ui/Card'
import { BookOpen, Users, Award, CreditCard } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  let stats = { courses: 0, users: 0, certificates: 0, subscriptions: 0 }

  try {
    const [courses, users, certificates, subscriptions] = await Promise.all([
      prisma.course.count(),
      prisma.user.count(),
      prisma.certificate.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    ])
    stats = { courses, users, certificates, subscriptions }
  } catch {
    //
  }

  const cards = [
    { label: 'Kurse', value: stats.courses, icon: BookOpen, href: 'admin/kurse' },
    { label: 'Nutzer', value: stats.users, icon: Users, href: 'admin/nutzer' },
    { label: 'Zertifikate', value: stats.certificates, icon: Award, href: 'admin/zertifikate' },
    { label: 'Aktive Abos', value: stats.subscriptions, icon: CreditCard, href: 'admin/abos' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card hover>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="text-xs text-neutral-500">{card.label}</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
