import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const tasks = await db.agentTask.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return NextResponse.json(tasks)
}
