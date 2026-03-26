import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET() {
  const userId = await getUserId()

  const tasks = await db.agentTask.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return NextResponse.json(tasks)
}
