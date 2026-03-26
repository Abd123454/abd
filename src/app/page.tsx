'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  title: string
  currentStreak: number
  totalTasksCompleted: number
}

interface Task {
  id: string
  title: string
  priority: string
  xpReward: number
  status: string
}

interface Habit {
  id: string
  name: string
  icon: string
  streak: number
  doneToday: boolean
}

interface Stats {
  level: number
  xp: number
  xpToNext: number
  streak: number
  tasksCompleted: number
  pendingTasks: number
  activeHabits: number
  balance: string
  avgMood: string | null
}

interface Settings {
  tawjihiDate: string
  chinaDate: string
  savingsGoal: number
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [dailyTip, setDailyTip] = useState('')
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())

  // Countdown states
  const [tawjihiCountdown, setTawjihiCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [chinaCountdown, setChinaCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [userRes, tasksRes, habitsRes, statsRes, settingsRes, tipRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/tasks?status=pending'),
        fetch('/api/habits'),
        fetch('/api/stats'),
        fetch('/api/settings'),
        fetch('/api/ai/daily-tip')
      ])

      if (userRes.ok) setUser(await userRes.json())
      if (tasksRes.ok) setTasks(await tasksRes.json())
      if (habitsRes.ok) setHabits(await habitsRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
      if (settingsRes.ok) setSettings(await settingsRes.json())
      if (tipRes.ok) {
        const tipData = await tipRes.json()
        setDailyTip(tipData.tip)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Update countdowns
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date().getTime()

      // Tawjihi countdown
      const tawjihiDate = new Date(settings?.tawjihiDate || '2026-06-15').getTime()
      const tDiff = tawjihiDate - now
      if (tDiff > 0) {
        setTawjihiCountdown({
          days: Math.floor(tDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((tDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((tDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((tDiff % (1000 * 60)) / 1000)
        })
      }

      // China countdown
      const chinaDate = new Date(settings?.chinaDate || '2026-09-01').getTime()
      const cDiff = chinaDate - now
      if (cDiff > 0) {
        setChinaCountdown({
          days: Math.floor(cDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((cDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((cDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((cDiff % (1000 * 60)) / 1000)
        })
      }
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [settings])

  const completeTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const completeHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}/complete`, { method: 'POST' })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error completing habit:', error)
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return 'صباح الخير'
    if (hour < 17) return 'مساء الخير'
    return 'مساء النور'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#FF4560'
      case 'high': return '#FFA500'
      case 'medium': return '#388BFD'
      case 'low': return '#7A90B0'
      default: return '#7A90B0'
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0A0F1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif',
        color: '#7A90B0'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{
            width: 40,
            height: 40,
            border: '3px solid #1E2D4A',
            borderTopColor: '#388BFD',
            borderRadius: '50%',
            margin: '0 auto 16px'
          }} />
          <p>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F1E',
      direction: 'rtl',
      fontFamily: 'Cairo, sans-serif',
      padding: '24px'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            {getGreeting()}، {user?.name || 'عبد العزيز'} 👋
          </h1>
          <p style={{ color: '#7A90B0', fontSize: 14 }}>
            {time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => router.push('/agent')}
            style={{
              background: '#388BFD',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🤖 الوكيل
          </button>
          <button
            onClick={logout}
            style={{
              background: 'transparent',
              color: '#7A90B0',
              border: '1px solid #1E2D4A',
              borderRadius: 10,
              padding: '10px 20px',
              fontFamily: 'Cairo, sans-serif',
              cursor: 'pointer'
            }}
          >
            خروج
          </button>
        </div>
      </header>

      {/* Countdown Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Tawjihi Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(200, 160, 60, 0.1), rgba(200, 160, 60, 0.05))',
          border: '1px solid rgba(200, 160, 60, 0.3)',
          borderRadius: 16,
          padding: 24,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 32 }}>📚</span>
            <div>
              <h3 style={{ color: '#C8A03C', fontSize: 18, fontWeight: 700 }}>التوجيهي</h3>
              <p style={{ color: '#7A90B0', fontSize: 12 }}>15 يونيو 2026</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {[
              { label: 'يوم', value: tawjihiCountdown.days },
              { label: 'ساعة', value: tawjihiCountdown.hours },
              { label: 'دقيقة', value: tawjihiCountdown.minutes },
              { label: 'ثانية', value: tawjihiCountdown.seconds }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(200, 160, 60, 0.2)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  minWidth: 60
                }}>
                  <span style={{ color: '#C8A03C', fontSize: 24, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span style={{ color: '#7A90B0', fontSize: 11, marginTop: 4, display: 'block' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* China Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 230, 255, 0.1), rgba(0, 230, 255, 0.05))',
          border: '1px solid rgba(0, 230, 255, 0.3)',
          borderRadius: 16,
          padding: 24,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 32 }}>✈️</span>
            <div>
              <h3 style={{ color: '#00E6FF', fontSize: 18, fontWeight: 700 }}>الصين</h3>
              <p style={{ color: '#7A90B0', fontSize: 12 }}>1 سبتمبر 2026</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {[
              { label: 'يوم', value: chinaCountdown.days },
              { label: 'ساعة', value: chinaCountdown.hours },
              { label: 'دقيقة', value: chinaCountdown.minutes },
              { label: 'ثانية', value: chinaCountdown.seconds }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(0, 230, 255, 0.2)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  minWidth: 60
                }}>
                  <span style={{ color: '#00E6FF', fontSize: 24, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span style={{ color: '#7A90B0', fontSize: 11, marginTop: 4, display: 'block' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 24
      }}>
        {[
          { label: 'المستوى', value: stats?.level || 1, icon: '🎯', color: '#388BFD' },
          { label: 'XP', value: `${stats?.xp || 0}/${stats?.xpToNext || 100}`, icon: '⚡', color: '#00E6FF' },
          { label: 'التوفير', value: `₪${stats?.balance || 0}`, icon: '💰', color: '#00E096' },
          { label: 'السلسلة', value: `${stats?.streak || 0} يوم`, icon: '🔥', color: '#FF4560' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#0F172A',
            border: '1px solid rgba(56, 139, 253, 0.15)',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center'
          }}>
            <span style={{ fontSize: 24 }}>{stat.icon}</span>
            <p style={{ color: stat.color, fontSize: 20, fontWeight: 700, marginTop: 8 }}>{stat.value}</p>
            <p style={{ color: '#7A90B0', fontSize: 12 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* User Card & Daily Tip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* User Progress Card */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 16,
          padding: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #388BFD, #00E6FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700
            }}>
              LV {user?.level || 1}
            </div>
            <div>
              <h3 style={{ color: '#E8EDF5', fontSize: 18, fontWeight: 700 }}>{user?.name || 'عبد العزيز'}</h3>
              <p style={{ color: '#7A90B0', fontSize: 13 }}>{user?.title || 'مبتدئ'}</p>
            </div>
          </div>
          {/* XP Bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#7A90B0', fontSize: 12 }}>الخبرة</span>
              <span style={{ color: '#00E6FF', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                {user?.xp || 0} / {user?.xpToNextLevel || 100}
              </span>
            </div>
            <div style={{
              background: '#080D18',
              borderRadius: 8,
              height: 12,
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #388BFD, #00E6FF)',
                height: '100%',
                width: `${((user?.xp || 0) / (user?.xpToNextLevel || 100)) * 100}%`,
                borderRadius: 8,
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div>
              <span style={{ color: '#00E6FF', fontSize: 16, fontWeight: 700 }}>{stats?.tasksCompleted || 0}</span>
              <span style={{ color: '#7A90B0', fontSize: 12, marginRight: 4 }}>مهمة مكتملة</span>
            </div>
            <div>
              <span style={{ color: '#00E096', fontSize: 16, fontWeight: 700 }}>{stats?.activeHabits || 0}</span>
              <span style={{ color: '#7A90B0', fontSize: 12, marginRight: 4 }}>عادة نشطة</span>
            </div>
          </div>
        </div>

        {/* Daily Tip */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(56, 139, 253, 0.1), rgba(56, 139, 253, 0.05))',
          border: '1px solid rgba(56, 139, 253, 0.3)',
          borderRadius: 16,
          padding: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <h3 style={{ color: '#388BFD', fontSize: 16, fontWeight: 700 }}>توصية اليوم</h3>
          </div>
          <p style={{ color: '#E8EDF5', fontSize: 15, lineHeight: 1.6 }}>{dailyTip || 'أنت على المسار الصحيح. استمر!'}</p>
        </div>
      </div>

      {/* Today's Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Tasks */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 16,
          padding: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700 }}>📝 مهام اليوم</h3>
            <button
              onClick={() => router.push('/tasks')}
              style={{
                background: 'transparent',
                color: '#388BFD',
                border: 'none',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              عرض الكل
            </button>
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid #1E2D4A'
              }}>
                <button
                  onClick={() => completeTask(task.id)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: '2px solid #388BFD',
                    background: 'transparent',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                />
                <span style={{ color: '#E8EDF5', fontSize: 14, flex: 1 }}>{task.title}</span>
                <span style={{
                  background: `${getPriorityColor(task.priority)}20`,
                  color: getPriorityColor(task.priority),
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  +{task.xpReward}XP
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <p style={{ color: '#7A90B0', fontSize: 14, textAlign: 'center', padding: 20 }}>
                لا توجد مهام معلقة
              </p>
            )}
          </div>
        </div>

        {/* Habits */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 16,
          padding: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700 }}>⭕ عادات اليوم</h3>
            <button
              onClick={() => router.push('/habits')}
              style={{
                background: 'transparent',
                color: '#388BFD',
                border: 'none',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              عرض الكل
            </button>
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {habits.map(habit => (
              <div key={habit.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid #1E2D4A'
              }}>
                <span style={{ fontSize: 20 }}>{habit.icon}</span>
                <span style={{ color: '#E8EDF5', fontSize: 14, flex: 1 }}>{habit.name}</span>
                <span style={{ color: '#7A90B0', fontSize: 12 }}>🔥 {habit.streak}</span>
                <button
                  onClick={() => !habit.doneToday && completeHabit(habit.id)}
                  disabled={habit.doneToday}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: 'none',
                    background: habit.doneToday ? '#00E096' : '#388BFD',
                    color: 'white',
                    cursor: habit.doneToday ? 'default' : 'pointer',
                    fontSize: 14
                  }}
                >
                  {habit.doneToday ? '✓' : '○'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12
      }}>
        {[
          { label: 'سجل اليوم', icon: '📝', path: '/mental' },
          { label: 'تسجيل عادة', icon: '⭕', path: '/habits' },
          { label: 'إضافة مهمة', icon: '✅', path: '/tasks' },
          { label: 'تحدث مع AI', icon: '🤖', path: '/agent' }
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => router.push(action.path)}
            style={{
              background: '#0F172A',
              border: '1px solid rgba(56, 139, 253, 0.15)',
              borderRadius: 12,
              padding: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#388BFD'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(56, 139, 253, 0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>{action.icon}</span>
            <span style={{ color: '#E8EDF5', fontSize: 14 }}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Navigation Footer */}
      <nav style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 8,
        marginTop: 24,
        padding: 16,
        background: '#0F172A',
        borderRadius: 16,
        border: '1px solid rgba(56, 139, 253, 0.15)'
      }}>
        {[
          { label: 'المهام', icon: '✅', path: '/tasks' },
          { label: 'العادات', icon: '⭕', path: '/habits' },
          { label: 'المالية', icon: '💰', path: '/finance' },
          { label: 'الصحة النفسية', icon: '🧠', path: '/mental' },
          { label: 'الشخصية', icon: '🎮', path: '/rpg' },
          { label: 'الأهداف', icon: '🎯', path: '/goals' },
          { label: 'الصين', icon: '✈️', path: '/china' },
          { label: 'التوجيهي', icon: '📚', path: '/tawjihi' },
          { label: 'ATS', icon: '⚡', path: '/ats' },
          { label: 'الإحصاءات', icon: '📊', path: '/stats' },
          { label: 'الإعدادات', icon: '⚙️', path: '/settings' }
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              border: 'none',
              padding: 10,
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(56, 139, 253, 0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <span>{item.icon}</span>
            <span style={{ color: '#E8EDF5', fontSize: 13 }}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
