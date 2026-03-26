import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default-user'
}

export async function GET() {
  try {
    const userId = await getUserId()
    
    let settings = await db.setting.findUnique({
      where: { userId }
    })

    if (!settings) {
      // Create default settings if not exists
      settings = await db.setting.create({
        data: { userId }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({
      tawjihiDate: '2026-06-15',
      chinaDate: '2026-09-01',
      savingsGoal: 26000
    })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId()
    const data = await req.json()

    const settings = await db.setting.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
