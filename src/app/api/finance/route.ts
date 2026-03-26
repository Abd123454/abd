import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default'
}

export async function GET() {
  const userId = await getUserId()

  const transactions = await db.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 50
  })

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return NextResponse.json({
    transactions,
    income,
    expenses,
    balance: income - expenses
  })
}

export async function POST(req: Request) {
  const userId = await getUserId()

  const { type, amount, category, description } = await req.json()

  const transaction = await db.transaction.create({
    data: {
      userId,
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date()
    }
  })

  return NextResponse.json(transaction)
}
