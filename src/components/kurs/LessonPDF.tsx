'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'

interface LessonPDFProps {
  content: Record<string, unknown>
  locale: string
}

export default function LessonPDF({ content, locale }: LessonPDFProps) {
  const pdfUrl = content.pdfUrl as string
  const requireFullScroll = (content.requireFullScroll as boolean) ?? false

  const [canComplete, setCanComplete] = useState(!requireFullScroll)
  const [countdown, setCountdown] = useState(requireFullScroll ? 5 : 0)

  useEffect(() => {
    if (!requireFullScroll) return
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          setCanComplete(true)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [requireFullScroll])

  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`

  return (
    <div className="space-y-4">
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-sm text-neutral-500 font-medium">
            {locale === 'en' ? 'Document viewer' : 'Dokument-Viewer'}
          </span>
          <div className="text-xs text-neutral-400">
            Twyne Academy
          </div>
        </div>
        <iframe
          src={viewerUrl}
          className="w-full"
          style={{ height: '600px', border: 'none' }}
          title="PDF Viewer"
        />
      </div>

      {requireFullScroll && !canComplete && (
        <div className="text-center text-sm text-neutral-500 bg-neutral-50 rounded-lg py-3">
          {locale === 'en'
            ? `Please read the document. Available in ${countdown}s...`
            : `Bitte lies das Dokument. Verfügbar in ${countdown}s...`}
        </div>
      )}
    </div>
  )
}
