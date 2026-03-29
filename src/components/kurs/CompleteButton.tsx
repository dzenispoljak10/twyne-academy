'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CompleteButtonProps {
  lessonId: string
  locale: string
  onComplete: (nextSlug?: string) => void
}

export default function CompleteButton({ lessonId, locale, onComplete }: CompleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/fortschritt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      })
      const data = await res.json()
      if (res.ok && data.passed) {
        onComplete(data.nextLesson?.slug)
      } else {
        setError(data.message ?? (locale === 'en' ? 'Error' : 'Fehler'))
      }
    } catch {
      setError(locale === 'en' ? 'Network error' : 'Netzwerkfehler')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <Button onClick={handle} loading={loading} className="w-full" size="lg">
        <CheckCircle className="h-5 w-5" />
        {locale === 'en' ? 'Complete lesson' : 'Lektion abschliessen'}
      </Button>
      {error && <p className="text-sm text-danger text-center">{error}</p>}
    </div>
  )
}
