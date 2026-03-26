import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
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
  const userId = await getUserId()
  const { id } = await params

  const body = await req.json()
  const task = await db.task.update({
    where: { id, userId },
    data: body
  })

  return NextResponse.json(task)
}
