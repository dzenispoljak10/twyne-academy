'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Lesson, LessonProgress } from '@prisma/client'
import LessonText from './LessonText'
import LessonQuiz from './LessonQuiz'
import LessonCode from './LessonCode'
import LessonPDF from './LessonPDF'
import LessonAudio from './LessonAudio'
import LessonVideo from './LessonVideo'
import CompleteButton from './CompleteButton'
import Button from '@/components/ui/Button'

interface LessonPlayerProps {
  lesson: Lesson
  progress: LessonProgress | null
  locale: string
  courseSlug: string
  prevLesson: { slug: string; title: string } | null
  nextLesson: { slug: string; title: string } | null
}

export default function LessonPlayer({
  lesson,
  progress,
  locale,
  courseSlug,
  prevLesson,
  nextLesson,
}: LessonPlayerProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState(progress?.status === 'COMPLETED')
  const [nextSlug, setNextSlug] = useState<string | null>(null)

  const getTitle = (t: unknown) =>
    (t as Record<string, string>)[locale] ?? (t as Record<string, string>).de ?? ''

  const handleComplete = (next?: string) => {
    setCompleted(true)
    if (next) setNextSlug(next)
  }

  const content = lesson.content as Record<string, unknown>

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Lesson title */}
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-6">
        {getTitle(lesson.title)}
      </h1>

      {/* Content by type */}
      <div className="mb-8">
        {lesson.type === 'TEXT' && <LessonText content={content} />}
        {lesson.type === 'QUIZ' && (
          <LessonQuiz
            content={content}
            lessonId={lesson.id}
            minScore={lesson.minScore ?? 70}
            locale={locale}
            onComplete={handleComplete}
          />
        )}
        {lesson.type === 'CODE' && <LessonCode content={content} locale={locale} />}
        {lesson.type === 'PDF' && <LessonPDF content={content} locale={locale} />}
        {lesson.type === 'AUDIO' && <LessonAudio content={content} />}
        {lesson.type === 'VIDEO' && <LessonVideo content={content} />}
      </div>

      {/* Complete button (not for quiz — quiz handles its own) */}
      {lesson.hasCheck && lesson.type !== 'QUIZ' && !completed && (
        <CompleteButton
          lessonId={lesson.id}
          locale={locale}
          onComplete={handleComplete}
        />
      )}

      {/* Success + next */}
      {completed && nextSlug && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
          <div className="flex-1">
            <p className="font-semibold text-green-800">
              {locale === 'en' ? 'Lesson completed!' : 'Lektion abgeschlossen!'}
            </p>
          </div>
          <Button size="sm" onClick={() => router.push(`/${locale}/lernen/${courseSlug}/${nextSlug}`)}>
            {locale === 'en' ? 'Next lesson' : 'Nächste Lektion'} →
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200 mt-8">
        {prevLesson ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/lernen/${courseSlug}/${prevLesson.slug}`}>
              <ChevronLeft className="h-4 w-4" /> {prevLesson.title}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {nextLesson && (
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/${locale}/lernen/${courseSlug}/${nextLesson.slug}`}>
              {nextLesson.title} <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
