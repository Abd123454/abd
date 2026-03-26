import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const limit = parseInt(new URL(req.url).searchParams.get('limit') || '50')

  const logs = await db.agentLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  })

  return NextResponse.json(logs.reverse())
}
