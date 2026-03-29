'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'

export default function ProfilPage() {
  const { data: session, update } = useSession()
  const params = useParams()
  const locale = (params.locale as string) ?? 'de'
  const { addToast } = useToast()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [lang, setLang] = useState(locale)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setFirstName(session.user.firstName ?? '')
      setLastName(session.user.lastName ?? '')
    }
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, birthDate, locale: lang }),
      })
      if (res.ok) {
        await update()
        addToast('success', locale === 'en' ? 'Profile saved!' : 'Profil gespeichert!')
      } else {
        addToast('error', locale === 'en' ? 'Error saving' : 'Fehler beim Speichern')
      }
    } catch {
      addToast('error', 'Error')
    }
    setSaving(false)
  }

  return (
    <div className="py-10 min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-display font-bold mb-8">
          {locale === 'en' ? 'My Profile' : 'Mein Profil'}
        </h1>

        <Card>
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
            <Avatar
              src={session?.user.image}
              firstName={firstName || session?.user.firstName}
              lastName={lastName || session?.user.lastName}
              size="lg"
            />
            <div>
              <p className="font-semibold text-neutral-900">
                {firstName || lastName ? `${firstName} ${lastName}` : session?.user.email}
              </p>
              <p className="text-sm text-neutral-400">{session?.user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label={locale === 'en' ? 'First name' : 'Vorname'}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                id="lastName"
                label={locale === 'en' ? 'Last name' : 'Nachname'}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <Input
              id="email"
              label="E-Mail"
              value={session?.user.email ?? ''}
              disabled
              className="bg-neutral-50 cursor-not-allowed"
            />

            <Input
              id="birthDate"
              type="date"
              label={locale === 'en' ? 'Date of birth' : 'Geburtsdatum'}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1.5">
                {locale === 'en' ? 'Language' : 'Sprache'}
              </label>
              <div className="flex gap-3">
                {[['de', 'Deutsch'], ['en', 'English'], ['fr', 'Français']].map(([l, label]) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      lang === l
                        ? 'bg-primary text-white border-primary'
                        : 'border-neutral-300 text-neutral-600 hover:border-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" loading={saving}>
              {locale === 'en' ? 'Save changes' : 'Änderungen speichern'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
