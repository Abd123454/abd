import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const habits = await db.habit.findMany({
    where: { userId, isActive: true },
    include: {
      completions: {
        where: { date: today }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return NextResponse.json(
    habits.map(h => ({
      ...h,
      doneToday: h.completions[0]?.completed || false
    }))
  )
}

export async function POST(req: Request) {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const { name, icon = '⭕', color = '#388BFD' } = await req.json()

  const habit = await db.habit.create({
    data: { userId, name, icon, color }
  })

  return NextResponse.json(habit)
}
