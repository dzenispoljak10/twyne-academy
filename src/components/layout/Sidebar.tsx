'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle, Lock, ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Course, Section, Lesson } from '@prisma/client'

interface SidebarProps {
  course: Course & { sections: (Section & { lessons: Lesson[] })[] }
  currentLessonId: string
  completedIds: Set<string>
  locale: string
  progressPct: number
}

export default function Sidebar({
  course,
  currentLessonId,
  completedIds,
  locale,
  progressPct,
}: SidebarProps) {
  const [open, setOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(
      course.sections
        .filter((s) => s.lessons.some((l) => l.id === currentLessonId))
        .map((s) => s.id)
    )
  )

  const getTitle = (t: unknown) =>
    (t as Record<string, string>)[locale] ?? (t as Record<string, string>).de ?? ''
  const courseSlug = course.slug

  const toggle = (id: string) =>
    setExpandedSections((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-display font-bold text-sm text-neutral-900 truncate">
          {getTitle(course.title)}
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs text-neutral-500 font-medium">{progressPct}%</span>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto py-2">
        {course.sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide hover:bg-neutral-50 transition-colors"
            >
              <span>{getTitle(section.title)}</span>
              {expandedSections.has(section.id) ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>

            {expandedSections.has(section.id) && (
              <div>
                {section.lessons.map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId
                  const isCompleted = completedIds.has(lesson.id)
                  return (
                    <Link
                      key={lesson.id}
                      href={`/${locale}/lernen/${courseSlug}/${lesson.slug}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                        isCurrent
                          ? 'bg-primary-50 text-primary border-r-2 border-primary font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      )}
                    >
                      <span className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <div className={cn('h-4 w-4 rounded-full border-2', isCurrent ? 'border-primary' : 'border-neutral-300')} />
                        )}
                      </span>
                      <span className="flex-1 truncate">{getTitle(lesson.title)}</span>
                      {lesson.isFree && (
                        <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">Free</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-40 bg-primary text-white p-3 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="w-80 h-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-neutral-200 bg-white h-full sticky top-16">
        {sidebarContent}
      </aside>
    </>
  )
}
