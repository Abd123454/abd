import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  const userId = session?.id || 'default-user'
  const { id } = await params

  await db.task.update({
    where: { id, userId },
    data: { status: 'deleted' }
  })

  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  const userId = session?.id || 'default-user'
  const { id } = await params

  const body = await req.json()
  const task = await db.task.update({
    where: { id, userId },
    data: body
  })

  return NextResponse.json(task)
}
