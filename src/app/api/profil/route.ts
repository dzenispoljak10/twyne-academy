import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { profileUpdateSchema } from '@/lib/validations'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { firstName, lastName, birthDate, locale } = parsed.data

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      locale,
    },
  })

  return NextResponse.json({ user })
}
