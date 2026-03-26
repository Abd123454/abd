import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET() {
  const userId = await getUserId()

  const components = await db.aTSComponent.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })

  return NextResponse.json(components)
}

export async function PATCH(req: Request) {
  const userId = await getUserId()

  const { id, status, notes } = await req.json()

  const component = await db.aTSComponent.update({
    where: { id, userId },
    data: { status, notes }
  })

  return NextResponse.json(component)
}
