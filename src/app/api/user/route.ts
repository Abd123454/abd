import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get first user (no auth required)
    const user = await db.user.findFirst({
      select: {
        id: true,
        name: true,
        level: true,
        xp: true,
        xpToNextLevel: true,
        title: true,
        currentStreak: true,
        totalTasksCompleted: true
      }
    })

    if (!user) {
      // Create default user if none exists
      const newUser = await db.user.create({
        data: { name: 'عبد العزيز' }
      })
      await db.account.create({
        data: {
          email: 'user@masari.app',
          passwordHash: 'no-auth',
          userId: newUser.id
        }
      })
      await db.setting.create({ data: { userId: newUser.id } })
      return NextResponse.json({
        id: newUser.id,
        name: newUser.name,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        title: 'مبتدئ',
        currentStreak: 0,
        totalTasksCompleted: 0
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
