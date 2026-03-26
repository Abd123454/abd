import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const zai = createOpenAI({
  apiKey: process.env.ZAI_API_KEY || '',
  baseURL: 'https://api.z.ai/v1'
})

const requestMap = new Map<string, number[]>()

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const session = await getSession()
    const userId = session?.id || 'default-user'

    // Rate limiting
    const now = Date.now()
    const requests = (requestMap.get(userId) || []).filter(t => t > now - 86400000)
    if (requests.length >= 100) {
      return new Response(JSON.stringify({ error: 'تجاوزت الحد اليومي' }), { status: 429 })
    }
    requestMap.set(userId, [...requests, now])

    // Fetch all user data
    const [user, tasks, habits, goals, transactions, moods, memories, conversations, settings] = await Promise.all([
      db.user.findFirst({ where: { id: userId } }),
      db.task.findMany({ where: { userId, status: 'pending' }, orderBy: { createdAt: 'desc' }, take: 20 }),
      db.habit.findMany({
        where: { userId, isActive: true },
        include: { completions: { where: { date: { gte: new Date(Date.now() - 7 * 86400000) } } } }
      }),
      db.goal.findMany({ where: { userId }, take: 10 }),
      db.transaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 30 }),
      db.moodLog.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 14 }),
      db.aIMemory.findMany({ where: { userId }, orderBy: { importance: 'desc' }, take: 30 }),
      db.aIConversation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      db.setting.findFirst({ where: { userId } })
    ])

    // Calculate stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const habitsToday = habits.map(h => ({
      ...h,
      doneToday: h.completions.some(c =>
        new Date(c.date).getTime() === today.getTime() && c.completed
      )
    }))

    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    const daysToTawjihi = Math.ceil((new Date(settings?.tawjihiDate || '2026-06-15').getTime() - Date.now()) / 86400000)
    const daysToChina = Math.ceil((new Date(settings?.chinaDate || '2026-09-01').getTime() - Date.now()) / 86400000)

    // Build system prompt
    const systemPrompt = `أنت "وكيل" — المساعد الذكي لمنصة "مساري".
تتحدث بالعربية العامية الفلسطينية دائماً.
أنت وكيل حقيقي — تفكر، تخطط، تنفذ.

صاحبك: ${user?.name || 'عبد العزيز العقيلي'}
18 سنة — فلسطين — توجيهي كهرباء استعمال
حلمه: MIS في الصين (Zhejiang, SUIBE, Tianjin)
مشروع تخرجه: لوحة ATS كهربائية

المستوى: ${user?.level || 1} | XP: ${user?.xp || 0}/${user?.xpToNextLevel || 100}
السلسلة: ${user?.currentStreak || 0} يوم
التوجيهي: ${daysToTawjihi} يوم | الصين: ${daysToChina} يوم

المهام المعلقة (${tasks.length}):
${tasks.slice(0, 10).map(t => `• [${t.id.slice(-6)}] ${t.title} — ${t.priority}`).join('\n') || 'لا توجد'}

العادات:
${habitsToday.map(h => `${h.doneToday ? '✅' : '⬜'} ${h.name} — سلسلة: ${h.streak}`).join('\n') || 'لا توجد'}

المالية: رصيد ₪${(income - expenses).toFixed(0)} | هدف ₪${settings?.savingsGoal || 26000}

الأهداف: ${goals.map(g => `${g.title} ${g.progress}%`).join(' | ') || 'لا توجد'}

متوسط المزاج: ${moods.length ? (moods.reduce((sum, m) => sum + m.mood, 0) / moods.length).toFixed(1) : 'لم يُسجل'}/5

ذاكرتي:
${memories.map(m => `[${m.type}] ${m.content}`).join('\n') || 'لا توجد'}

المحادثات الأخيرة:
${conversations.slice(0, 10).reverse().map(c => `${c.role === 'user' ? 'هو' : 'أنا'}: ${c.content.slice(0, 100)}`).join('\n') || 'لا توجد'}

قواعدك:
- تفكر بصوت عالٍ: "دعني أتحقق..."
- تُخبره ماذا تفعل قبل التنفيذ
- احفظ كل معلومة مهمة تلقائياً
- إذا كتب مبلغاً → سجّله مالياً
- إذا كتب مهمة → أضفها
- ردود قصيرة وطبيعية`

    // Save user message
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'user') {
      await db.aIConversation.create({
        data: { userId, role: 'user', content: lastMessage.content }
      }).catch(() => {})
    }

    const result = await streamText({
      model: zai('glm-4-plus'),
      system: systemPrompt,
      messages,
      maxSteps: 5,
      tools: {
        create_task: {
          description: 'إنشاء مهمة جديدة',
          parameters: z.object({
            title: z.string(),
            priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
            category: z.string().optional(),
            dueDate: z.string().optional()
          }),
          execute: async ({ title, priority, category, dueDate }: { title: string; priority?: 'low' | 'medium' | 'high' | 'urgent'; category?: string; dueDate?: string }) => {
            const xpReward = { urgent: 25, high: 20, medium: 15, low: 10 }[priority || 'medium'] || 15
            const task = await db.task.create({
              data: {
                userId,
                title,
                priority: priority || 'medium',
                category,
                dueDate: dueDate ? new Date(dueDate) : null,
                xpReward
              }
            })

            const agentTask = await db.agentTask.create({
              data: { userId, title: `إضافة: ${title}`, type: 'action', status: 'done', result: `+${xpReward} XP` }
            })

            await db.agentLog.create({
              data: { userId, taskId: agentTask.id, type: 'action', content: `أضفت: "${title}" — ${priority}` }
            }).catch(() => {})

            return { success: true, task, message: `✅ "${title}" — +${xpReward} XP` }
          }
        },
        complete_task: {
          description: 'إكمال مهمة',
          parameters: z.object({ task_id: z.string() }),
          execute: async ({ task_id }: { task_id: string }) => {
            const task = await db.task.findFirst({ where: { id: task_id, userId } })
            if (!task) return { success: false, message: 'مش لاقي المهمة' }

            await db.task.update({ where: { id: task_id }, data: { status: 'completed', completedAt: new Date() } })

            const u = await db.user.findFirst({ where: { id: userId } })
            if (u) {
              const newXp = u.xp + task.xpReward
              const leveledUp = newXp >= u.xpToNextLevel

              await db.user.update({
                where: { id: userId },
                data: {
                  xp: leveledUp ? newXp - u.xpToNextLevel : newXp,
                  level: leveledUp ? u.level + 1 : u.level,
                  xpToNextLevel: leveledUp ? Math.floor(u.xpToNextLevel * 1.5) : u.xpToNextLevel,
                  totalTasksCompleted: { increment: 1 }
                }
              })

              if (leveledUp) return { success: true, leveledUp: true, newLevel: u.level + 1, message: `🎉 Level Up! المستوى ${u.level + 1}!` }
            }

            return { success: true, xpEarned: task.xpReward, message: `✅ تم! +${task.xpReward} XP` }
          }
        },
        list_tasks: {
          description: 'عرض المهام',
          parameters: z.object({ status: z.enum(['pending', 'completed', 'all']).default('pending') }),
          execute: async ({ status }: { status?: 'pending' | 'completed' | 'all' }) => {
            const t = await db.task.findMany({
              where: { userId, ...(status !== 'all' && { status: status || 'pending' }) },
              orderBy: { createdAt: 'desc' },
              take: 15
            })
            return { success: true, count: t.length, tasks: t }
          }
        },
        log_habit: {
          description: 'تسجيل عادة اليوم',
          parameters: z.object({ habit_name: z.string() }),
          execute: async ({ habit_name }: { habit_name: string }) => {
            const h = await db.habit.findFirst({ where: { userId, name: { contains: habit_name } } })
            if (!h) return { success: false, message: `ما لقيت "${habit_name}"` }

            const todayDate = new Date()
            todayDate.setHours(0, 0, 0, 0)

            await db.habitCompletion.upsert({
              where: { habitId_date: { habitId: h.id, date: todayDate } },
              create: { habitId: h.id, date: todayDate, completed: true, xpEarned: h.xpPerCompletion },
              update: { completed: true }
            })

            const newStreak = h.streak + 1
            await db.habit.update({
              where: { id: h.id },
              data: { streak: newStreak, bestStreak: Math.max(newStreak, h.bestStreak), totalCompletions: { increment: 1 } }
            })

            return { success: true, streak: newStreak, message: `🔥 "${h.name}" ✓ | ${newStreak} يوم` }
          }
        },
        log_mood: {
          description: 'تسجيل المزاج',
          parameters: z.object({ mood: z.number().min(1).max(5), note: z.string().optional() }),
          execute: async ({ mood, note }: { mood: number; note?: string }) => {
            const todayDate = new Date()
            todayDate.setHours(0, 0, 0, 0)

            await db.moodLog.upsert({
              where: { userId_date: { userId, date: todayDate } },
              create: { userId, mood, note, date: todayDate },
              update: { mood, note }
            })

            return { success: true, message: `${['😢', '😕', '😐', '🙂', '😊'][mood - 1]} تم التسجيل` }
          }
        },
        add_transaction: {
          description: 'تسجيل معاملة مالية بالشيكل ₪',
          parameters: z.object({
            type: z.enum(['income', 'expense']),
            amount: z.number(),
            category: z.string(),
            description: z.string().optional()
          }),
          execute: async ({ type, amount, category, description }: { type: 'income' | 'expense'; amount: number; category: string; description?: string }) => {
            await db.transaction.create({
              data: { userId, type, amount, category, description: description || '', date: new Date() }
            })
            return { success: true, message: `₪${amount} ${type === 'income' ? 'دخل' : 'مصروف'} — ${category}` }
          }
        },
        get_balance: {
          description: 'عرض الرصيد',
          parameters: z.object({}),
          execute: async () => {
            const tx = await db.transaction.findMany({ where: { userId } })
            const inc = tx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
            const exp = tx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            return { balance: (inc - exp).toFixed(0), income: inc.toFixed(0), expenses: exp.toFixed(0), goal: settings?.savingsGoal || 26000 }
          }
        },
        get_stats: {
          description: 'إحصائيات كاملة',
          parameters: z.object({}),
          execute: async () => {
            const u = await db.user.findFirst({ where: { id: userId } })
            const [p, h] = await Promise.all([
              db.task.count({ where: { userId, status: 'pending' } }),
              db.habit.count({ where: { userId, isActive: true } })
            ])
            return {
              level: u?.level || 1,
              xp: u?.xp || 0,
              xpToNext: u?.xpToNextLevel || 100,
              streak: u?.currentStreak || 0,
              tasksCompleted: u?.totalTasksCompleted || 0,
              pendingTasks: p,
              activeHabits: h,
              daysToTawjihi,
              daysToChina
            }
          }
        },
        save_memory: {
          description: 'حفظ معلومة في الذاكرة',
          parameters: z.object({
            content: z.string(),
            type: z.enum(['fact', 'preference', 'event', 'goal']),
            importance: z.number().min(1).max(5).default(3)
          }),
          execute: async ({ content, type, importance }: { content: string; type: 'fact' | 'preference' | 'event' | 'goal'; importance?: number }) => {
            await db.aIMemory.create({ data: { userId, content, type, importance: importance || 3 } })
            return { success: true, message: '💾 محفوظ' }
          }
        },
        create_goal: {
          description: 'إنشاء هدف',
          parameters: z.object({
            title: z.string(),
            category: z.string().default('personal'),
            targetDate: z.string().optional()
          }),
          execute: async ({ title, category, targetDate }: { title: string; category?: string; targetDate?: string }) => {
            const g = await db.goal.create({
              data: { userId, title, category: category || 'personal', targetDate: targetDate ? new Date(targetDate) : null }
            })
            return { success: true, goal: g, message: `🎯 "${title}"` }
          }
        }
      },
      onFinish: async ({ text }) => {
        if (text) {
          await db.aIConversation.create({
            data: { userId, role: 'assistant', content: text }
          }).catch(() => {})
        }
      }
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Agent error:', error)
    return new Response(JSON.stringify({ error: 'حدث خطأ' }), { status: 500 })
  }
}
