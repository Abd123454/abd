import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const memories = await db.aIMemory.findMany({
    where: { userId },
    orderBy: { importance: 'desc' },
    take: 30
  })

  return NextResponse.json(memories)
}
