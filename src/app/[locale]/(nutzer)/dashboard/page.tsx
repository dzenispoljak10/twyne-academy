import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { BookOpen, Award, ArrowRight } from 'lucide-react'
import type { Enrollment, Course, Certificate } from '@prisma/client'

type EnrollmentWithCourse = Enrollment & { course: Course }

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  const userId = session!.user.id

  let enrollments: EnrollmentWithCourse[] = []
  let certificates: Certificate[] = []
  let recommendedCourses: Course[] = []

  try {
    enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { enrolledAt: 'desc' },
      take: 6,
    })

    certificates = await prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
      take: 3,
    })

    const enrolledCourseIds = enrollments.map((e) => e.courseId)
    recommendedCourses = await prisma.course.findMany({
      where: { published: true, id: { notIn: enrolledCourseIds } },
      take: 3,
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    // DB not connected yet
  }

  const name = session!.user.firstName ?? session!.user.name ?? session!.user.email
  const hour = new Date().getHours()
  const greeting =
    locale === 'en'
      ? hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
      : hour < 12
      ? 'Guten Morgen'
      : hour < 18
      ? 'Guten Tag'
      : 'Guten Abend'

  const getTitle = (t: unknown) => (t as Record<string, string>)[locale] ?? (t as Record<string, string>).de ?? ''

  return (
    <div className="py-10 min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-7xl px-6">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          {greeting}, {name}!
        </h1>
        <p className="text-neutral-500 mb-10">
          {locale === 'en' ? 'Welcome back to Twyne Academy' : 'Willkommen zurück bei Twyne Academy'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: locale === 'en' ? 'Enrolled courses' : 'Eingeschriebene Kurse', value: enrollments.length, icon: BookOpen },
            { label: locale === 'en' ? 'Certificates' : 'Zertifikate', value: certificates.length, icon: Award },
          ].map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                  <div className="text-xs text-neutral-500">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* My courses */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold">
              {locale === 'en' ? 'My Courses' : 'Meine Kurse'}
            </h2>
            <Link href={`/${locale}/kurse`} className="text-sm text-primary hover:underline flex items-center gap-1">
              {locale === 'en' ? 'Discover more' : 'Mehr entdecken'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <Card className="text-center py-12">
              <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 mb-4">
                {locale === 'en' ? 'No courses started yet' : 'Noch kein Kurs gestartet'}
              </p>
              <Button asChild>
                <Link href={`/${locale}/kurse`}>
                  {locale === 'en' ? 'Discover courses' : 'Kurse entdecken'}
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} hover className="flex flex-col">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="neutral">{enrollment.course.category}</Badge>
                    {enrollment.completedAt && <Badge variant="success">
                      {locale === 'en' ? 'Completed' : 'Abgeschlossen'}
                    </Badge>}
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-4 flex-1">
                    {getTitle(enrollment.course.title)}
                  </h3>
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/${locale}/lernen/${enrollment.course.slug}`}>
                      {locale === 'en' ? 'Continue' : 'Weitermachen'}
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold">
                {locale === 'en' ? 'My Certificates' : 'Meine Zertifikate'}
              </h2>
              <Link href={`/${locale}/zertifikate`} className="text-sm text-primary hover:underline flex items-center gap-1">
                {locale === 'en' ? 'All certificates' : 'Alle Zertifikate'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <Card key={cert.id}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-neutral-900 truncate">{cert.courseTitle}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{cert.certNumber}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="w-full mt-3" asChild>
                    <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                      {locale === 'en' ? 'Download' : 'Herunterladen'}
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
