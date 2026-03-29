import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect(`/${locale}`)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-primary text-white px-6 py-3 text-sm font-medium">
        Admin-Bereich — Twyne Academy
      </div>
      {children}
    </div>
  )
}
