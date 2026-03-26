import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET() {
  try {
    const userId = await getUserId()

    const words = await db.chineseWord.findMany({
      where: { userId },
      orderBy: { addedAt: 'asc' }
    })

    return NextResponse.json({
      words,
      total: words.length,
      mastered: words.filter(w => w.mastered).length
    })
  } catch {
    return NextResponse.json({ words: [], total: 0, mastered: 0 })
  }
}

export async function PATCH(req: Request) {
  const userId = await getUserId()

  const { id, mastered } = await req.json()

  const word = await db.chineseWord.update({
    where: { id, userId },
    data: {
      mastered,
      timesReviewed: { increment: 1 },
      lastReviewed: new Date()
    }
  })

  return NextResponse.json(word)
}
