import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  const userId = session?.id || 'default-user'
  const { id } = await params

  const habit = await db.habit.findFirst({
    where: { id, userId }
  })

  if (!habit) {
    return NextResponse.json({ error: 'العادة غير موجودة' }, { status: 404 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await db.habitCompletion.upsert({
    where: { habitId_date: { habitId: id, date: today } },
    create: { habitId: id, date: today, completed: true, xpEarned: habit.xpPerCompletion },
    update: { completed: true }
  })

  const newStreak = habit.streak + 1

  await db.habit.update({
    where: { id },
    data: {
      streak: newStreak,
      bestStreak: Math.max(newStreak, habit.bestStreak),
      totalCompletions: { increment: 1 }
    }
  })

  return NextResponse.json({
    success: true,
    streak: newStreak,
    xpEarned: habit.xpPerCompletion
  })
}
