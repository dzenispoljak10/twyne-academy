import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { BookOpen } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'en' ? 'Courses' : locale === 'fr' ? 'Cours' : 'Kurse' }
}

export default async function KursePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let courses: Awaited<ReturnType<typeof prisma.course.findMany>> = []
  try {
    courses = await prisma.course.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    // DB not yet connected — show empty state
  }

  const getTitle = (title: unknown) => {
    const t = title as Record<string, string>
    return t[locale] ?? t.de ?? ''
  }

  return (
    <div className="py-12 min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-7xl px-6">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
          {locale === 'en' ? 'All Courses' : locale === 'fr' ? 'Tous les cours' : 'Alle Kurse'}
        </h1>

        {courses.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-500 mb-2">
              {locale === 'en' ? 'No courses yet' : 'Noch keine Kurse'}
            </h2>
            <p className="text-neutral-400 text-sm">
              {locale === 'en' ? 'Check back soon!' : 'Schau bald wieder vorbei!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} hover className="flex flex-col">
                <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary-500" />
                </div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="neutral">{course.category}</Badge>
                  {course.level && <Badge variant="primary">{course.level}</Badge>}
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2 flex-1">
                  {getTitle(course.title)}
                </h3>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-sm font-semibold">
                    {course.accessType === 'FREE'
                      ? locale === 'en' ? 'Free' : 'Kostenlos'
                      : course.price
                      ? `CHF ${(course.price / 100).toFixed(2)}`
                      : 'Abo'}
                  </span>
                  <Button size="sm" asChild>
                    <Link href={`/${locale}/kurse/${course.slug}`}>
                      {locale === 'en' ? 'View course' : 'Zum Kurs'}
                    </Link>
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
