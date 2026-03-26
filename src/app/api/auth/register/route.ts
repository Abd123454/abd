import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد وكلمة المرور مطلوبان' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
    }

    const existingAccount = await db.account.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingAccount) {
      return NextResponse.json({ error: 'البريد مستخدم بالفعل' }, { status: 400 })
    }

    // Create user
    const user = await db.user.create({
      data: { name: name || 'عبد العزيز' }
    })

    // Create account
    await db.account.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        userId: user.id
      }
    })

    // Create settings
    await db.setting.create({
      data: { userId: user.id }
    })

    // Create default habits
    await db.habit.createMany({
      data: [
        { userId: user.id, name: 'دراسة التوجيهي', icon: '📚', color: '#388BFD' },
        { userId: user.id, name: 'صينية HSK', icon: '🀄', color: '#FF4560' },
        { userId: user.id, name: 'رياضة', icon: '💪', color: '#00E096' },
      ]
    })

    // Create default Tawjihi subjects
    await db.tawjihiSubject.createMany({
      data: [
        { userId: user.id, name: 'الكهرباء العملية', targetHours: 60 },
        { userId: user.id, name: 'الكهرباء النظرية', targetHours: 50 },
        { userId: user.id, name: 'الرياضيات', targetHours: 40 },
        { userId: user.id, name: 'اللغة العربية', targetHours: 30 },
        { userId: user.id, name: 'اللغة الإنجليزية', targetHours: 25 },
        { userId: user.id, name: 'التربية الوطنية', targetHours: 20 },
      ]
    })

    // Create default ATS components
    await db.aTSComponent.createMany({
      data: [
        { userId: user.id, name: 'KM1', type: 'contactor', status: 'pending', notes: 'قاطع التغذية الرئيسية' },
        { userId: user.id, name: 'KM2', type: 'contactor', status: 'pending', notes: 'قاطع المولد' },
        { userId: user.id, name: 'T1', type: 'timer', status: 'pending', notes: 'مؤقت تأخير التحويل' },
        { userId: user.id, name: 'T2', type: 'timer', status: 'pending', notes: 'مؤقت إعادة التغذية' },
        { userId: user.id, name: 'Voltage Relay', type: 'relay', status: 'pending', notes: 'مرحل مراقبة الجهد' },
        { userId: user.id, name: 'Selector Switch', type: 'switch', status: 'pending', notes: 'Auto/Manual' },
        { userId: user.id, name: 'MCB Main', type: 'breaker', status: 'pending', notes: 'قاطع حماية الشبكة' },
        { userId: user.id, name: 'MCB Generator', type: 'breaker', status: 'pending', notes: 'قاطع حماية المولد' },
      ]
    })

    // Create default Chinese words
    await db.chineseWord.createMany({
      data: [
        { userId: user.id, chinese: '你好', pinyin: 'nǐ hǎo', arabic: 'مرحبا', hskLevel: 1 },
        { userId: user.id, chinese: '谢谢', pinyin: 'xiè xie', arabic: 'شكراً', hskLevel: 1 },
        { userId: user.id, chinese: '中国', pinyin: 'zhōng guó', arabic: 'الصين', hskLevel: 1 },
        { userId: user.id, chinese: '学习', pinyin: 'xué xí', arabic: 'دراسة', hskLevel: 1 },
        { userId: user.id, chinese: '大学', pinyin: 'dà xué', arabic: 'جامعة', hskLevel: 1 },
        { userId: user.id, chinese: '朋友', pinyin: 'péng yǒu', arabic: 'صديق', hskLevel: 1 },
        { userId: user.id, chinese: '今天', pinyin: 'jīn tiān', arabic: 'اليوم', hskLevel: 1 },
        { userId: user.id, chinese: '明天', pinyin: 'míng tiān', arabic: 'غداً', hskLevel: 1 },
        { userId: user.id, chinese: '飞机', pinyin: 'fēi jī', arabic: 'طائرة', hskLevel: 1 },
        { userId: user.id, chinese: '奖学金', pinyin: 'jiǎng xué jīn', arabic: 'منحة دراسية', hskLevel: 2 },
        { userId: user.id, chinese: '工作', pinyin: 'gōng zuò', arabic: 'عمل', hskLevel: 1 },
        { userId: user.id, chinese: '钱', pinyin: 'qián', arabic: 'مال', hskLevel: 1 },
        { userId: user.id, chinese: '北京', pinyin: 'běi jīng', arabic: 'بكين', hskLevel: 1 },
        { userId: user.id, chinese: '老师', pinyin: 'lǎo shī', arabic: 'مدرس', hskLevel: 1 },
        { userId: user.id, chinese: '学生', pinyin: 'xué shēng', arabic: 'طالب', hskLevel: 1 },
      ]
    })

    // Create default goals
    await db.goal.createMany({
      data: [
        { userId: user.id, title: 'توفير ₪26,000 للصين', category: 'finance' },
        { userId: user.id, title: 'التحضير للصين', category: 'travel', progress: 15 },
      ]
    })

    // Create achievements
    const achievements = await db.achievement.findMany()
    if (achievements.length === 0) {
      await db.achievement.createMany({
        data: [
          { name: 'البداية', description: 'أكملت أول مهمة', icon: '🎯', xpReward: 50, type: 'tasks', requirement: 1 },
          { name: 'مثابر', description: 'أكملت 10 مهام', icon: '💪', xpReward: 100, type: 'tasks', requirement: 10 },
          { name: 'محترف', description: 'أكملت 50 مهمة', icon: '🏆', xpReward: 250, type: 'tasks', requirement: 50 },
          { name: 'سلسلة قوية', description: 'حافظت على سلسلة 7 أيام', icon: '🔥', xpReward: 100, type: 'streak', requirement: 7 },
          { name: 'سلسلة أسطورية', description: 'حافظت على سلسلة 30 يوم', icon: '⚡', xpReward: 500, type: 'streak', requirement: 30 },
          { name: 'موفّر', description: 'وفّرت ₪5,000', icon: '💰', xpReward: 150, type: 'savings', requirement: 5000 },
          { name: 'هدف الصين', description: 'وفّرت ₪26,000', icon: '✈️', xpReward: 1000, type: 'savings', requirement: 26000 },
          { name: 'متعلم', description: 'أتقنت 50 كلمة صينية', icon: '🀄', xpReward: 200, type: 'chinese', requirement: 50 },
        ]
      })
    }

    await createSession(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء التسجيل' }, { status: 500 })
  }
}
