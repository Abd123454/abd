import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createSession } from '@/lib/auth'

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }

    if (attempts.count >= 5 && now - attempts.lastAttempt < 900000) {
      return NextResponse.json(
        { error: 'محاولات كثيرة. حاول بعد 15 دقيقة' },
        { status: 429 }
      )
    }

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const account = await db.account.findUnique({
      where: { email: email.toLowerCase() }
    })

    const isValid = account ? verifyPassword(password, account.passwordHash) : false

    if (!account || !isValid) {
      loginAttempts.set(ip, { count: attempts.count + 1, lastAttempt: now })
      return NextResponse.json({ error: 'البريد أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    // Reset attempts on successful login
    loginAttempts.set(ip, { count: 0, lastAttempt: now })

    await createSession(account.userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الدخول' }, { status: 500 })
  }
}
