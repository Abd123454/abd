import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET() {
  const userId = await getUserId()

  const goals = await db.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { milestones: true }
  })

  return NextResponse.json(goals)
}

export async function POST(req: Request) {
  const userId = await getUserId()

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
