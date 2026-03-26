import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const status = new URL(req.url).searchParams.get('status') || 'pending'
  const where = status === 'all'
    ? { userId, status: { not: 'deleted' } }
    : { userId, status }

  const tasks = await db.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const { title, priority = 'medium', category, dueDate, description } = await req.json()

  if (!title) {
    return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 })
  }

  const xpReward = { urgent: 25, high: 20, medium: 15, low: 10 }[priority] || 15

  const task = await db.task.create({
    data: {
      userId,
      title,
      priority,
      category,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      xpReward
    }
  })

  return NextResponse.json(task)
}
