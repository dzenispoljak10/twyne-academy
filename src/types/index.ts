import type { Course, Section, Lesson, LessonProgress, User, Certificate, Enrollment, Subscription, Purchase } from '@prisma/client'

// ─── Course types ───────────────────────────────────────────────────────────

export type CourseWithSections = Course & {
  sections: (Section & {
    lessons: Lesson[]
  })[]
  _count?: { enrollments: number }
}

export type LessonWithProgress = Lesson & {
  progress?: LessonProgress[]
  section?: Section & { course?: Course }
}

export type UserWithRelations = User & {
  enrollments?: Enrollment[]
  certificates?: Certificate[]
  subscription?: Subscription | null
  purchases?: Purchase[]
}

export type CertificateWithUser = Certificate & {
  user: User
  course: Course
}

// ─── Lesson content types ───────────────────────────────────────────────────

export interface LessonContentText {
  markdown: string
}

export interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'fill_blank'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation?: string
}

export interface LessonContentQuiz {
  questions: QuizQuestion[]
  maxAttempts?: number
}

export interface LessonContentCode {
  language: string
  starterCode: string
  solution?: string
  instructions: string
  expectedOutput?: string
}

export interface LessonContentPDF {
  pdfUrl: string
  requireFullScroll?: boolean
}

export interface LessonContentAudio {
  audioUrl: string
  transcript?: string
  duration?: number
}

export interface LessonContentVideo {
  youtubeId: string
  duration?: number
}

// ─── Access types ────────────────────────────────────────────────────────────

export interface AccessResult {
  allowed: boolean
  reason?: 'NOT_ENROLLED' | 'NO_SUBSCRIPTION' | 'PREV_NOT_COMPLETE' | 'EXPIRED'
  blockedBy?: string
}

// ─── API payload types ───────────────────────────────────────────────────────

export interface ProgressUpdatePayload {
  lessonId: string
  score?: number
}

export interface ProgressUpdateResponse {
  passed: boolean
  message?: string
  nextLesson?: {
    slug: string
    kursSlug: string
  }
}

// ─── i18n ────────────────────────────────────────────────────────────────────

export type Locale = 'de' | 'en' | 'fr'

// ─── UI types ────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  protected?: boolean
}

export interface PricingPlan {
  id: string
  name: string
  price: number | null
  currency: string
  interval?: string
  features: string[]
  highlighted?: boolean
  stripePriceId?: string
}
