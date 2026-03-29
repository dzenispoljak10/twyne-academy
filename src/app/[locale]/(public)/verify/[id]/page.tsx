import type { Metadata } from 'next'
import { CheckCircle, XCircle } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Zertifikat verifizieren' }

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  let cert = null
  try {
    cert = await prisma.certificate.findUnique({ where: { certNumber: id } })
  } catch {
    //
  }

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-danger mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold mb-2">
            {locale === 'en' ? 'Certificate not found' : 'Zertifikat nicht gefunden'}
          </h1>
          <p className="text-neutral-500">{id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold mb-1">
          {locale === 'en' ? 'Valid Certificate' : 'Gültiges Zertifikat'}
        </h1>
        <p className="text-neutral-500 mb-6">
          {locale === 'en'
            ? 'This certificate has been verified by Twyne Academy.'
            : 'Dieses Zertifikat wurde von Twyne Academy verifiziert.'}
        </p>
        <div className="bg-neutral-50 rounded-xl p-5 text-left space-y-3">
          <div>
            <span className="text-xs text-neutral-400 block">
              {locale === 'en' ? 'Certificate holder' : 'Zertifikatsinhaber'}
            </span>
            <span className="font-semibold text-neutral-900">{cert.userName}</span>
          </div>
          <div>
            <span className="text-xs text-neutral-400 block">
              {locale === 'en' ? 'Course' : 'Kurs'}
            </span>
            <span className="font-semibold text-neutral-900">{cert.courseTitle}</span>
          </div>
          <div>
            <span className="text-xs text-neutral-400 block">
              {locale === 'en' ? 'Issued on' : 'Ausgestellt am'}
            </span>
            <span className="font-semibold text-neutral-900">{formatDate(cert.issuedAt, locale)}</span>
          </div>
          <div>
            <span className="text-xs text-neutral-400 block">Certificate ID</span>
            <span className="font-mono text-sm text-neutral-600">{cert.certNumber}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
