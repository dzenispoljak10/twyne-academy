import { z } from 'zod'

export const progressUpdateSchema = z.object({
  lessonId: z.string().cuid(),
  score: z.number().min(0).max(100).optional(),
})

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  birthDate: z.string().optional(),
  locale: z.enum(['de', 'en', 'fr']),
})

export const courseCreateSchema = z.object({
  slug: z.string().min(3).max(100),
  title: z.record(z.string(), z.string()),
  description: z.record(z.string(), z.string()),
  category: z.string().min(1),
  accessType: z.enum(['FREE', 'PAID', 'SUBSCRIPTION', 'TRIAL']),
  price: z.number().optional(),
  level: z.string().optional(),
  published: z.boolean().default(false),
})

export const lessonUpdateSchema = z.object({
  title: z.record(z.string(), z.string()),
  type: z.enum(['TEXT', 'QUIZ', 'CODE', 'PDF', 'AUDIO', 'VIDEO']),
  content: z.record(z.string(), z.unknown()),
  order: z.number().int().min(0),
  isRequired: z.boolean().default(true),
  hasCheck: z.boolean().default(true),
  minScore: z.number().min(0).max(100).optional(),
  isFree: z.boolean().default(false),
})

export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type CourseCreateInput = z.infer<typeof courseCreateSchema>
export type LessonUpdateInput = z.infer<typeof lessonUpdateSchema>
