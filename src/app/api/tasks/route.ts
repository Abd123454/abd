import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = { userId }
    if (status) where.status = status

    const tasks = await db.task.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId()
    const data = await req.json()

    const task = await db.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description || '',
        priority: data.priority || 'medium',
        xpReward: data.xpReward || 25,
        status: 'pending',
        dueDate: data.dueDate ? new Date(data.dueDate) : null
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
