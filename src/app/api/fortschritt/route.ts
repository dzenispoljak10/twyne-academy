import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { canAccessLesson, checkCourseCompletion } from '@/lib/access'
import { progressUpdateSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = progressUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { lessonId, score } = parsed.data
  const userId = session.user.id

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } },
  })
  if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })

  const access = await canAccessLesson(userId, lessonId)
  if (!access.allowed) {
    return NextResponse.json({ error: 'Access denied', reason: access.reason }, { status: 403 })
  }

  // For quiz: check minimum score
  if (lesson.type === 'QUIZ' && lesson.minScore && score !== undefined) {
    if (score < lesson.minScore) {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { status: 'FAILED', score, attempts: { increment: 1 } },
        create: { userId, lessonId, status: 'FAILED', score, attempts: 1 },
      })
      return NextResponse.json({
        passed: false,
        message: `Mindest-Score: ${lesson.minScore}%`,
      })
    }
  }

  // Mark as completed
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { status: 'COMPLETED', score, completedAt: new Date(), attempts: { increment: 1 } },
    create: { userId, lessonId, status: 'COMPLETED', score, completedAt: new Date(), attempts: 1 },
  })

  // Check if whole course is completed (non-blocking)
  checkCourseCompletion(userId, lesson.section.courseId).catch(console.error)

  // Find next lesson
  const nextLessonSameSection = await prisma.lesson.findFirst({
    where: { sectionId: lesson.sectionId, order: lesson.order + 1 },
    include: { section: { include: { course: true } } },
  })

  let nextLesson = nextLessonSameSection

  if (!nextLesson) {
    const nextSection = await prisma.section.findFirst({
      where: { courseId: lesson.section.courseId, order: lesson.section.order + 1 },
      include: { lessons: { orderBy: { order: 'asc' }, take: 1 } },
    })
    if (nextSection?.lessons[0]) {
      nextLesson = {
        ...nextSection.lessons[0],
        section: {
          ...nextSection,
          course: lesson.section.course,
        },
      }
    }
  }

  return NextResponse.json({
    passed: true,
    nextLesson: nextLesson
      ? { slug: nextLesson.slug, kursSlug: lesson.section.course.slug }
      : null,
  })
}
