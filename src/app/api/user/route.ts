import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  let user = await db.user.findFirst({ where: { id: userId } })
  if (!user) {
    user = await db.user.create({ data: { id: 'default-user' } })
  }

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const body = await req.json()
  const user = await db.user.update({
    where: { id: userId },
    data: {
      name: body.name,
      title: body.title
    }
  })

  return NextResponse.json(user)
}
