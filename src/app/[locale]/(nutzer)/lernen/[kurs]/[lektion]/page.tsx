import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { canAccessLesson } from '@/lib/access'
import LessonPlayer from '@/components/kurs/LessonPlayer'
import Sidebar from '@/components/layout/Sidebar'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; kurs: string; lektion: string }>
}): Promise<Metadata> {
  const { locale, lektion, kurs } = await params
  try {
    const lesson = await prisma.lesson.findFirst({
      where: { slug: lektion, section: { course: { slug: kurs } } },
    })
    if (!lesson) return {}
    return { title: (lesson.title as Record<string, string>)[locale] ?? '' }
  } catch {
    return {}
  }
}

export default async function LernPage({
  params,
}: {
  params: Promise<{ locale: string; kurs: string; lektion: string }>
}) {
  const { locale, kurs, lektion } = await params
  const session = await auth()
  if (!session) redirect(`/${locale}/login`)

  let course
  let lesson
  let progress

  try {
    course = await prisma.course.findUnique({
      where: { slug: kurs },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } },
        },
      },
    })

    if (!course) notFound()

    lesson = await prisma.lesson.findFirst({
      where: { slug: lektion, section: { courseId: course.id } },
    })

    if (!lesson) notFound()

    const access = await canAccessLesson(session.user.id, lesson.id)
    if (!access.allowed) {
      redirect(`/${locale}/kurse/${kurs}`)
    }

    progress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
    })
  } catch (e) {
    if ((e as Error).message?.includes('NEXT_REDIRECT')) throw e
    notFound()
  }

  const allLessons = course!.sections.flatMap((s) => s.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === lesson!.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const completedIds = new Set(
    (
      await prisma.lessonProgress.findMany({
        where: { userId: session.user.id, status: 'COMPLETED', lessonId: { in: allLessons.map((l) => l.id) } },
      })
    ).map((p) => p.lessonId)
  )

  const completedCount = completedIds.size
  const totalRequired = allLessons.filter((l) => l.isRequired).length
  const progressPct = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0

  const getTitle = (t: unknown) => (t as Record<string, string>)[locale] ?? (t as Record<string, string>).de ?? ''

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar
        course={course!}
        currentLessonId={lesson!.id}
        completedIds={completedIds}
        locale={locale}
        progressPct={progressPct}
      />
      <main className="flex-1 overflow-y-auto bg-neutral-50">
        <LessonPlayer
          lesson={lesson!}
          progress={progress}
          locale={locale}
          courseSlug={kurs}
          prevLesson={prevLesson ? { slug: prevLesson.slug, title: getTitle(prevLesson.title) } : null}
          nextLesson={nextLesson ? { slug: nextLesson.slug, title: getTitle(nextLesson.title) } : null}
        />
      </main>
    </div>
  )
}
