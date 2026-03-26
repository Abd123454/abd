import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default-user'
}

export async function GET() {
  try {
    const userId = await getUserId()
    
    // Return user's goals as memories
    const goals = await db.goal.findMany({
      where: { userId },
      take: 10
    })

    const memories = goals.map(g => ({
      id: g.id,
      type: 'goal',
      content: g.title,
      importance: 5
    }))

    return NextResponse.json(memories)
  } catch (error) {
    console.error('Get memories error:', error)
    return NextResponse.json([])
  }
}
