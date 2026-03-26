import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const goals = await db.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { milestones: true }
  })

  return NextResponse.json(goals)
}

export async function POST(req: Request) {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const { title, category = 'personal', targetDate } = await req.json()

  const goal = await db.goal.create({
    data: {
      userId,
      title,
      category,
      targetDate: targetDate ? new Date(targetDate) : null
    }
  })

  return NextResponse.json(goal)
}
