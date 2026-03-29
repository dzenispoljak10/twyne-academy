'use client'

import { useParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { signOut } from 'next-auth/react'

export default function EinstellungenPage() {
  const params = useParams()
  const locale = (params.locale as string) ?? 'de'

  return (
    <div className="py-10 min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-display font-bold mb-8">
          {locale === 'en' ? 'Settings' : 'Einstellungen'}
        </h1>

        <div className="space-y-4">
          <Card>
            <h2 className="font-semibold mb-4">{locale === 'en' ? 'Notifications' : 'Benachrichtigungen'}</h2>
            <p className="text-sm text-neutral-500">
              {locale === 'en' ? 'Notification settings coming soon.' : 'Benachrichtigungseinstellungen kommen bald.'}
            </p>
          </Card>

          <Card>
            <h2 className="font-semibold text-danger mb-4">
              {locale === 'en' ? 'Danger Zone' : 'Gefahrenzone'}
            </h2>
            <p className="text-sm text-neutral-500 mb-4">
              {locale === 'en'
                ? 'Deleting your account is permanent and cannot be undone.'
                : 'Das Löschen deines Kontos ist dauerhaft und kann nicht rückgängig gemacht werden.'}
            </p>
            <Button variant="danger" size="sm">
              {locale === 'en' ? 'Delete account' : 'Konto löschen'}
            </Button>
          </Card>

          <Card>
            <Button
              variant="secondary"
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="w-full"
            >
              {locale === 'en' ? 'Sign out' : 'Abmelden'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
