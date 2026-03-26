import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const account = await db.account.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        if (!account) return null

        const isValid = verifyPassword(credentials.password, account.passwordHash)
        if (!isValid) return null

        const user = await db.user.findUnique({
          where: { id: account.userId }
        })

        return user ? { id: user.id, name: user.name, email: account.email } : null
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        // Check if user exists
        const existingAccount = await db.account.findUnique({
          where: { email: user.email.toLowerCase() }
        })

        if (!existingAccount) {
          // Create new user
          const newUser = await db.user.create({
            data: { name: user.name || 'مستخدم جديد' }
          })

          await db.account.create({
            data: {
              email: user.email.toLowerCase(),
              passwordHash: hashPassword(Math.random().toString(36)), // Random password for Google users
              userId: newUser.id
            }
          })

          await db.setting.create({
            data: { userId: newUser.id }
          })

          await db.habit.createMany({
            data: [
              { userId: newUser.id, name: 'دراسة التوجيهي', icon: '📚', color: '#388BFD' },
              { userId: newUser.id, name: 'صينية HSK', icon: '🀄', color: '#FF4560' },
              { userId: newUser.id, name: 'رياضة', icon: '💪', color: '#00E096' },
            ]
          })

          await db.tawjihiSubject.createMany({
            data: [
              { userId: newUser.id, name: 'الكهرباء العملية', targetHours: 60 },
              { userId: newUser.id, name: 'الكهرباء النظرية', targetHours: 50 },
              { userId: newUser.id, name: 'الرياضيات', targetHours: 40 },
              { userId: newUser.id, name: 'اللغة العربية', targetHours: 30 },
              { userId: newUser.id, name: 'اللغة الإنجليزية', targetHours: 25 },
            ]
          })

          await db.chineseWord.createMany({
            data: [
              { userId: newUser.id, chinese: '你好', pinyin: 'nǐ hǎo', arabic: 'مرحبا', hskLevel: 1 },
              { userId: newUser.id, chinese: '谢谢', pinyin: 'xiè xie', arabic: 'شكراً', hskLevel: 1 },
              { userId: newUser.id, chinese: '中国', pinyin: 'zhōng guó', arabic: 'الصين', hskLevel: 1 },
              { userId: newUser.id, chinese: '学习', pinyin: 'xué xí', arabic: 'دراسة', hskLevel: 1 },
              { userId: newUser.id, chinese: '大学', pinyin: 'dà xué', arabic: 'جامعة', hskLevel: 1 },
            ]
          })

          await db.goal.createMany({
            data: [
              { userId: newUser.id, title: 'توفير ₪26,000 للصين', category: 'finance' },
              { userId: newUser.id, title: 'التحضير للصين', category: 'travel', progress: 15 },
            ]
          })
        }

        return true
      }
      return true
    },
    async session({ session, user, token }) {
      if (session.user?.email) {
        const account = await db.account.findUnique({
          where: { email: session.user.email.toLowerCase() },
          include: { user: true }
        })
        if (account?.user) {
          session.user.id = account.user.id
          session.user.name = account.user.name
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || 'masari-secret-key-2024'
})

export { handler as GET, handler as POST }
