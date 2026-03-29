import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { courseCreateSchema } from '@/lib/validations'

async function checkAdmin() {
  const session = await auth()
  return session?.user.role === 'ADMIN' ? session : null
}

export async function GET() {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { enrollments: true } } },
  })
  return NextResponse.json(courses)
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await req.json()
  const parsed = courseCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { title, description, ...rest } = parsed.data
  const course = await prisma.course.create({
    data: {
      ...rest,
      title: title as object,
      description: description as object,
    },
  })
  return NextResponse.json(course, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await req.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const course = await prisma.course.update({ where: { id }, data })
  return NextResponse.json(course)
}

export async function DELETE(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await prisma.course.delete({ where: { id } })
  return NextResponse.json({ deleted: true })
}
