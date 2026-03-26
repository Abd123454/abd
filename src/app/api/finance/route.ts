import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const userId = session?.id || 'default-user'

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
  const session = await getSession()
  const userId = session?.id || 'default-user'

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
