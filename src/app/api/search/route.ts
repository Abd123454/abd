import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const query = new URL(req.url).searchParams.get('q')?.slice(0, 50) || ''
  const session = await getSession()
  const userId = session?.id || 'default-user'

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const [tasks, habits, goals] = await Promise.all([
    db.task.findMany({
      where: { userId, title: { contains: query } },
      take: 5
    }),
    db.habit.findMany({
      where: { userId, name: { contains: query } },
      take: 3
    }),
    db.goal.findMany({
      where: { userId, title: { contains: query } },
      take: 3
    })
  ])

  const results = [
    ...tasks.map(t => ({ type: 'مهمة', title: t.title, url: '/tasks' })),
    ...habits.map(h => ({ type: 'عادة', title: h.name, url: '/habits' })),
    ...goals.map(g => ({ type: 'هدف', title: g.title, url: '/goals' }))
  ]

  return NextResponse.json({ results })
}
