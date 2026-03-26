import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  let settings = await db.setting.findFirst({ where: { userId } })

  if (!settings) {
    settings = await db.setting.create({ data: { userId } })
  }

  return NextResponse.json(settings)
}

export async function PUT(req: Request) {
  const session = await getSession()
  const userId = session?.id || 'default-user'

  const body = await req.json()

  const settings = await db.setting.upsert({
    where: { userId },
    create: { userId, ...body },
    update: body
  })

  return NextResponse.json(settings)
}
