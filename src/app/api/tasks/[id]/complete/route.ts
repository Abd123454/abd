import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  const { id } = await params

  const task = await db.task.findFirst({
    where: { id, userId }
  })

  if (!task) {
    return NextResponse.json({ error: 'المهمة غير موجودة' }, { status: 404 })
  }

  await db.task.update({
    where: { id },
    data: { status: 'completed', completedAt: new Date() }
  })

  const user = await db.user.findFirst({ where: { id: userId } })

  if (user) {
    const newXp = user.xp + task.xpReward
    const leveledUp = newXp >= user.xpToNextLevel

    await db.user.update({
      where: { id: userId },
      data: {
        xp: leveledUp ? newXp - user.xpToNextLevel : newXp,
        level: leveledUp ? user.level + 1 : user.level,
        xpToNextLevel: leveledUp ? Math.floor(user.xpToNextLevel * 1.5) : user.xpToNextLevel,
        totalTasksCompleted: { increment: 1 }
      }
    })

    if (leveledUp) {
      return NextResponse.json({
        success: true,
        leveledUp: true,
        newLevel: user.level + 1,
        xpEarned: task.xpReward
      })
    }
  }

  return NextResponse.json({ success: true, xpEarned: task.xpReward })
}
