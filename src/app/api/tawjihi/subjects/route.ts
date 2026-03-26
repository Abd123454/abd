import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET() {
  const userId = await getUserId()

  const subjects = await db.tawjihiSubject.findMany({
    where: { userId },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
        take: 10
      }
    }
  })

  return NextResponse.json(subjects)
}

export async function POST(req: Request) {
  const userId = await getUserId()

  const { subjectId, hours, notes } = await req.json()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await db.studySession.create({
    data: { userId, subjectId, hours, date: today, notes }
  })

  await db.tawjihiSubject.update({
    where: { id: subjectId },
    data: { studyHours: { increment: hours } }
  })

  return NextResponse.json({ success: true })
}
