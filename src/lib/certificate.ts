import prisma from './prisma'
import { uploadToR2 } from './r2'
import { generateCertNumber, formatDate } from './utils'
import { sendCertificateEmail } from './email'

export async function generateCertificate(userId: string, courseId: string): Promise<void> {
  // Check if already exists
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })
  if (existing) return

  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.course.findUnique({ where: { id: courseId } }),
  ])

  if (!user || !course) return

  const locale = user.locale ?? course.certificateLocale ?? 'de'
  const certNumber = generateCertNumber()
  const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  const courseTitle = (course.title as Record<string, string>)[locale] ?? (course.title as Record<string, string>)['de'] ?? 'Kurs'

  // Generate PDF buffer using React PDF
  let pdfBuffer: Buffer
  try {
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { createElement } = await import('react')
    const { CertificateTemplate } = await import('@/components/zertifikat/CertificateTemplate')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfBuffer = await renderToBuffer(
      createElement(CertificateTemplate as any, {
        certNumber,
        userName,
        userBirth: user.birthDate ? formatDate(user.birthDate, locale) : undefined,
        courseTitle,
        issuedAt: formatDate(new Date(), locale),
        locale,
        appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://twyneacademy.com',
      }) as any
    )
  } catch (err) {
    console.error('PDF generation failed:', err)
    return
  }

  const key = `certificates/${certNumber}.pdf`
  const pdfUrl = await uploadToR2(key, pdfBuffer, 'application/pdf')

  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      certNumber,
      pdfUrl,
      userName,
      userBirth: user.birthDate,
      courseTitle,
      locale,
    },
  })

  // Mark enrollment as completed
  await prisma.enrollment.updateMany({
    where: { userId, courseId },
    data: { completedAt: new Date() },
  })

  sendCertificateEmail(user, certificate, course).catch(console.error)
}
