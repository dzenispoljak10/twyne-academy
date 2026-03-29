import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { BookOpen, Clock, Award } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const course = await prisma.course.findUnique({ where: { slug } })
    if (!course) return {}
    const title = (course.title as Record<string, string>)[locale] ?? ''
    return { title }
  } catch {
    return {}
  }
}

export default async function KursDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  let course
  try {
    course = await prisma.course.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } },
        },
      },
    })
  } catch {
    notFound()
  }

  if (!course) notFound()

  const session = await auth()
  const getTitle = (t: unknown) => (t as Record<string, string>)[locale] ?? (t as Record<string, string>).de ?? ''

  return (
    <div className="py-12 min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex gap-2 mb-4">
              <Badge variant="neutral">{course.category}</Badge>
              {course.level && <Badge variant="primary">{course.level}</Badge>}
            </div>
            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-4">
              {getTitle(course.title)}
            </h1>
            <p className="text-neutral-600 leading-relaxed mb-6">
              {getTitle(course.description)}
            </p>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-neutral-500">
              {course.durationMin && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {course.durationMin} min
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {course.sections.reduce((a, s) => a + s.lessons.length, 0)}{' '}
                {locale === 'en' ? 'lessons' : 'Lektionen'}
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                {locale === 'en' ? 'Certificate included' : 'Zertifikat inklusive'}
              </div>
            </div>

            {/* Curriculum */}
            <h2 className="text-xl font-display font-bold mb-4">
              {locale === 'en' ? 'Course content' : 'Kursinhalt'}
            </h2>
            <div className="space-y-3">
              {course.sections.map((section) => (
                <div key={section.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                  <div className="px-4 py-3 bg-neutral-50 font-semibold text-sm text-neutral-700 border-b border-neutral-200">
                    {getTitle(section.title)}
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="px-4 py-3 flex items-center justify-between text-sm">
                        <span className="text-neutral-700">{getTitle(lesson.title)}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="neutral" className="text-xs">{lesson.type}</Badge>
                          {lesson.isFree && <Badge variant="success" className="text-xs">Free</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sticky top-24">
              <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mb-4 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">
                {course.accessType === 'FREE'
                  ? locale === 'en' ? 'Free' : 'Kostenlos'
                  : course.price
                  ? `CHF ${(course.price / 100).toFixed(2)}`
                  : locale === 'en' ? 'With subscription' : 'Mit Abo'}
              </div>
              {session ? (
                <Button className="w-full mt-4" asChild>
                  <Link href={`/${locale}/lernen/${course.slug}/${course.sections[0]?.lessons[0]?.slug ?? ''}`}>
                    {locale === 'en' ? 'Start course' : 'Kurs starten'}
                  </Link>
                </Button>
              ) : (
                <Button className="w-full mt-4" asChild>
                  <Link href={`/${locale}/registrieren`}>
                    {locale === 'en' ? 'Sign up & start' : 'Registrieren & starten'}
                  </Link>
                </Button>
              )}
              {course.accessType !== 'FREE' && (
                <Link href={`/${locale}/preise`} className="block text-center text-sm text-primary mt-3 hover:underline">
                  {locale === 'en' ? 'View subscription plans' : 'Abo-Pläne ansehen'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
