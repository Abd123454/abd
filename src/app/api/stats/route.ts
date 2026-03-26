import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET() {
  const userId = await getUserId()

  const [user, pendingTasks, habits, moods, transactions] = await Promise.all([
    db.user.findFirst({ where: { id: userId } }),
    db.task.count({ where: { userId, status: 'pending' } }),
    db.habit.count({ where: { userId, isActive: true } }),
    db.moodLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 7
    }),
    db.transaction.findMany({ where: { userId } })
  ])

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const avgMood = moods.length
    ? (moods.reduce((sum, m) => sum + m.mood, 0) / moods.length).toFixed(1)
    : null

  return NextResponse.json({
    level: user?.level || 1,
    xp: user?.xp || 0,
    xpToNext: user?.xpToNextLevel || 100,
    streak: user?.currentStreak || 0,
    tasksCompleted: user?.totalTasksCompleted || 0,
    pendingTasks,
    activeHabits: habits,
    balance: (income - expenses).toFixed(0),
    avgMood,
    recentMoods: moods
  })
}
