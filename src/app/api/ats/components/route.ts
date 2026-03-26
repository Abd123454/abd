import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const components = await db.aTSComponent.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })

  return NextResponse.json(components)
}

export async function PATCH(req: Request) {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const { id, status, notes } = await req.json()

  const component = await db.aTSComponent.update({
    where: { id, userId },
    data: { status, notes }
  })

  return NextResponse.json(component)
}
