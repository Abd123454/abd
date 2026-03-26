import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const [pendingTasks, user] = await Promise.all([
    db.task.count({ where: { userId, status: 'pending' } }),
    db.user.findFirst({ where: { id: userId } })
  ])

  const days = Math.ceil((new Date('2026-06-15').getTime() - Date.now()) / 86400000)

  let tip = ''

  if (days < 85) {
    tip = `${days} يوم على التوجيهي — كل ساعة دراسة الآن تساوي عشراً بعدها`
  } else if (pendingTasks > 5) {
    tip = `عندك ${pendingTasks} مهام معلقة — ركّز على 3 منها اليوم`
  } else if (!user || user.currentStreak === 0) {
    tip = 'ابدأ عادة واحدة صغيرة اليوم — حتى 5 دقائق تكفي'
  } else {
    tip = 'أنت على المسار الصحيح. كمّل 💪'
  }

  return NextResponse.json({ tip })
}
