import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET(req: NextRequest) {
  const userId = await getUserId()

  const days = parseInt(new URL(req.url).searchParams.get('days') || '30')

  const moods = await db.moodLog.findMany({
    where: {
      userId,
      date: { gte: new Date(Date.now() - days * 86400000) }
    },
    orderBy: { date: 'desc' }
  })

  return NextResponse.json(moods)
}

export async function POST(req: Request) {
  const userId = await getUserId()

  const { mood, energy, stress, note } = await req.json()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const moodLog = await db.moodLog.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, mood, energy, stress, note, date: today },
    update: { mood, energy, stress, note }
  })

  return NextResponse.json(moodLog)
}
