import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getUserId() {
  const user = await db.user.findFirst()
  return user?.id || 'default-user'
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId()
    const body = await req.json()
    const userMessage = body.messages?.slice(-1)?.[0]?.content || ''

    // Simple response logic
    let response = ''

    if (userMessage.includes('مهمة') || userMessage.includes('اضف مهمة') || userMessage.includes('أضف مهمة')) {
      // Create a task
      const task = await db.task.create({
        data: {
          userId,
          title: userMessage.replace('أضف مهمة', '').replace('اضف مهمة', '').replace('ضيف مهمة', '').trim() || 'مهمة جديدة',
          priority: 'medium',
          xpReward: 25,
          status: 'pending'
        }
      })
      response = `✅ تم إنشاء المهمة "${task.title}" بنجاح! ستحصل على ${task.xpReward} XP عند إكمالها.`
    } else if (userMessage.includes('رصيد') || userMessage.includes('مال') || userMessage.includes('finance')) {
      const transactions = await db.transaction.findMany({ where: { userId } })
      const balance = transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
      response = `💰 رصيدك الحالي: ₪${balance.toLocaleString()}\n\nالهدف: ₪26,000 للصين 🇨🇳`
    } else if (userMessage.includes('مزاج') || userMessage.includes('mood')) {
      response = '😊 كيف تشعر اليوم؟ يمكنك اختيار:\n\n1️⃣ ممتاز\n2️⃣ جيد\n3️⃣ متوسط\n4️⃣ سيء\n\nاختر رقماً أو اكتب وصفاً لمزاجك.'
    } else if (userMessage.includes('إحصائيات') || userMessage.includes('stats')) {
      const user = await db.user.findUnique({ where: { id: userId } })
      const tasks = await db.task.count({ where: { userId, status: 'completed' } })
      const habits = await db.habit.count({ where: { userId, isActive: true } })
      response = `📊 إحصائياتك:\n\n🎯 المستوى: ${user?.level || 1}\n⚡ XP: ${user?.xp || 0}/${user?.xpToNextLevel || 100}\n🔥 السلسلة: ${user?.currentStreak || 0} يوم\n✅ المهام المكتملة: ${tasks}\n⭕ العادات النشطة: ${habits}`
    } else {
      response = `أهلاً! 👋 أنا الوكيل الذكي لمساري.\n\nأستطيع مساعدتك في:\n• 📝 إضافة مهام جديدة\n• 💰 عرض رصيدك المالي\n• 😊 تسجيل مزاجك\n• 📊 عرض إحصائياتك\n\nماذا تريد أن تفعل؟`
    }

    return NextResponse.json({ content: response })
  } catch (error) {
    console.error('Agent error:', error)
    return NextResponse.json({ content: 'حدث خطأ، حاول مرة أخرى.' })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Agent API is running' })
}
