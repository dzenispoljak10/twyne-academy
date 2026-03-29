'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/types'

interface LessonQuizProps {
  content: Record<string, unknown>
  lessonId: string
  minScore: number
  locale: string
  onComplete: (nextSlug?: string) => void
}

export default function LessonQuiz({ content, lessonId, minScore, locale, onComplete }: LessonQuizProps) {
  const questions = (content.questions as QuizQuestion[]) ?? []
  const maxAttempts = (content.maxAttempts as number) ?? 3

  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)

  const passed = submitted && score >= minScore

  const handleAnswer = (questionId: string, answer: string | number) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    const correct = questions.filter((q) => {
      const answer = answers[q.id]
      return String(answer) === String(q.correctAnswer)
    }).length
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    setSubmitted(true)
    setAttempts((a) => a + 1)

    if (pct >= minScore) {
      setLoading(true)
      try {
        const res = await fetch('/api/fortschritt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId, score: pct }),
        })
        if (res.ok) {
          const data = await res.json()
          onComplete(data.nextLesson?.slug)
        }
      } catch {
        //
      }
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={q.id} className="bg-white border border-neutral-200 rounded-xl p-5">
          <p className="font-semibold text-neutral-900 mb-4">
            {i + 1}. {q.question}
          </p>

          {q.type === 'multiple_choice' && q.options && (
            <div className="space-y-2">
              {q.options.map((option, oi) => {
                const selected = answers[q.id] === oi
                const isCorrect = submitted && oi === q.correctAnswer
                const isWrong = submitted && selected && oi !== q.correctAnswer
                return (
                  <button
                    key={oi}
                    onClick={() => handleAnswer(q.id, oi)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
                      selected && !submitted && 'border-primary bg-primary-50',
                      isCorrect && 'border-success bg-green-50 text-green-800',
                      isWrong && 'border-danger bg-red-50 text-red-800',
                      !selected && !isCorrect && 'border-neutral-200 hover:border-neutral-300',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-4 w-4 rounded-full border-2 flex-shrink-0',
                        selected ? 'border-primary bg-primary' : 'border-neutral-300',
                        isCorrect && 'border-success bg-success',
                        isWrong && 'border-danger bg-danger',
                      )} />
                      {option}
                      {isCorrect && <CheckCircle className="h-4 w-4 ml-auto text-success" />}
                      {isWrong && <XCircle className="h-4 w-4 ml-auto text-danger" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {q.type === 'fill_blank' && (
            <input
              type="text"
              disabled={submitted}
              value={(answers[q.id] as string) ?? ''}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              placeholder={locale === 'en' ? 'Your answer...' : 'Deine Antwort...'}
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary',
                submitted && String(answers[q.id]) === String(q.correctAnswer)
                  ? 'border-success bg-green-50'
                  : submitted
                  ? 'border-danger bg-red-50'
                  : 'border-neutral-300',
              )}
            />
          )}

          {submitted && q.explanation && (
            <p className="mt-3 text-xs text-neutral-500 bg-neutral-50 rounded-lg px-3 py-2">
              {q.explanation}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full"
        >
          {locale === 'en' ? 'Submit answers' : 'Antworten einreichen'}
        </Button>
      ) : (
        <div>
          <div className={cn(
            'p-4 rounded-xl border mb-4',
            passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
          )}>
            <div className="flex items-center gap-2 mb-1">
              {passed
                ? <CheckCircle className="h-5 w-5 text-success" />
                : <XCircle className="h-5 w-5 text-danger" />}
              <span className="font-semibold">
                {passed
                  ? locale === 'en' ? 'Passed!' : 'Bestanden!'
                  : locale === 'en' ? 'Not passed' : 'Nicht bestanden'}
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              {locale === 'en' ? 'Score' : 'Ergebnis'}: {score}% (
              {locale === 'en' ? 'minimum' : 'Mindest'}: {minScore}%)
            </p>
          </div>

          {!passed && attempts < maxAttempts && (
            <Button variant="secondary" onClick={handleRetry} loading={loading} className="w-full">
              {locale === 'en' ? 'Try again' : 'Nochmals versuchen'} ({attempts}/{maxAttempts})
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
