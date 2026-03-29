import prisma from './prisma'
import type { AccessResult } from '@/types'

export async function checkCourseAccess(
  userId: string,
  courseId: string
): Promise<AccessResult> {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) return { allowed: false, reason: 'NOT_ENROLLED' }

  if (course.accessType === 'FREE') return { allowed: true }

  if (course.accessType === 'PAID') {
    const purchase = await prisma.purchase.findFirst({ where: { userId, courseId } })
    return purchase ? { allowed: true } : { allowed: false, reason: 'NOT_ENROLLED' }
  }

  if (course.accessType === 'SUBSCRIPTION') {
    const sub = await prisma.subscription.findUnique({ where: { userId } })
    if (sub && (sub.status === 'ACTIVE' || sub.status === 'TRIALING')) {
      return { allowed: true }
    }
    return { allowed: false, reason: 'NO_SUBSCRIPTION' }
  }

  if (course.accessType === 'TRIAL') {
    const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } })
    if (!enrollment) return { allowed: false, reason: 'NOT_ENROLLED' }
    if (enrollment.expiresAt && enrollment.expiresAt < new Date()) {
      return { allowed: false, reason: 'EXPIRED' }
    }
    return { allowed: true }
  }

  return { allowed: false, reason: 'NOT_ENROLLED' }
}

export async function canAccessLesson(
  userId: string,
  lessonId: string
): Promise<AccessResult> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } },
  })

  if (!lesson) return { allowed: false, reason: 'NOT_ENROLLED' }

  const courseAccess = await checkCourseAccess(userId, lesson.section.courseId)
  if (!courseAccess.allowed) return courseAccess

  if (lesson.isFree) return { allowed: true }

  // First lesson of first section is always free preview
  if (lesson.order === 1 && lesson.section.order === 1) return { allowed: true }

  // Find previous lesson
  const prevLessonSameSection = await prisma.lesson.findFirst({
    where: { sectionId: lesson.sectionId, order: lesson.order - 1 },
  })

  let prevLesson = prevLessonSameSection

  if (!prevLesson && lesson.order === 1) {
    // First of a section — check last lesson of previous section
    const prevSection = await prisma.section.findFirst({
      where: { courseId: lesson.section.courseId, order: lesson.section.order - 1 },
      include: { lessons: { orderBy: { order: 'desc' }, take: 1 } },
    })
    prevLesson = prevSection?.lessons[0] ?? null
  }

  if (!prevLesson) return { allowed: true }

  const prevProgress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: prevLesson.id } },
  })

  if (prevProgress?.status === 'COMPLETED') return { allowed: true }

  const prevTitle = (prevLesson.title as Record<string, string>)['de'] ?? 'Vorherige Lektion'
  return { allowed: false, reason: 'PREV_NOT_COMPLETE', blockedBy: prevTitle }
}

export async function checkCourseCompletion(userId: string, courseId: string): Promise<void> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { sections: { include: { lessons: { where: { isRequired: true } } } } },
  })
  if (!course) return

  const requiredLessons = course.sections.flatMap((s) => s.lessons)
  const completedCount = await prisma.lessonProgress.count({
    where: {
      userId,
      status: 'COMPLETED',
      lessonId: { in: requiredLessons.map((l) => l.id) },
    },
  })

  if (completedCount >= requiredLessons.length) {
    // Import dynamically to avoid circular deps
    const { generateCertificate } = await import('./certificate')
    // Non-blocking
    generateCertificate(userId, courseId).catch(console.error)
  }
}
