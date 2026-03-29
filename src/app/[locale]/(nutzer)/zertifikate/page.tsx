import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Award, Download, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Zertifikate' }

export default async function ZertifikatePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  let certificates: Awaited<ReturnType<typeof prisma.certificate.findMany>> = []
  try {
    certificates = await prisma.certificate.findMany({
      where: { userId: session!.user.id },
      orderBy: { issuedAt: 'desc' },
    })
  } catch {
    //
  }

  return (
    <div className="py-10 min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-4xl px-6">
        <h1 className="text-3xl font-display font-bold mb-8">
          {locale === 'en' ? 'My Certificates' : 'Meine Zertifikate'}
        </h1>

        {certificates.length === 0 ? (
          <Card className="text-center py-16">
            <Award className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg mb-2">
              {locale === 'en' ? 'No certificates yet' : 'Noch keine Zertifikate'}
            </p>
            <p className="text-neutral-400 text-sm">
              {locale === 'en'
                ? 'Complete a course to earn your first certificate!'
                : 'Schliesse einen Kurs ab um dein erstes Zertifikat zu erhalten!'}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-neutral-900 mb-0.5 truncate">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-xs text-neutral-400">{cert.certNumber}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {locale === 'en' ? 'Issued' : 'Ausgestellt'}: {formatDate(cert.issuedAt, locale)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" asChild className="flex-1">
                    <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      {locale === 'en' ? 'Download' : 'Herunterladen'}
                    </a>
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <a
                      href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.courseTitle)}&organizationName=Twyne+Academy&certUrl=${encodeURIComponent(cert.pdfUrl)}&certId=${cert.certNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
