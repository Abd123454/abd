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
  longestStreak: number
  totalTasksCompleted: number
}

interface Stats {
  activeHabits: number
  tasksCompleted: number
}

export default function RPGPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats>({ activeHabits: 0, tasksCompleted: 0 })
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/stats')
      ])
      if (userRes.ok) setUser(await userRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getTitles = () => {
    const titles = [
      { level: 1, title: 'مبتدئ', icon: '🌱' },
      { level: 3, title: 'متعلم', icon: '📚' },
      { level: 5, title: 'مثابر', icon: '💪' },
      { level: 10, title: 'محترف', icon: '⭐' },
      { level: 15, title: 'خبير', icon: '🏅' },
      { level: 20, title: 'أسطورة', icon: '👑' },
    ]
    return titles
  }

  const getCurrentTitle = () => {
    const titles = getTitles()
    const current = titles.filter(t => (user?.level || 1) >= t.level).pop()
    return current || titles[0]
  }

  const getNextTitle = () => {
    const titles = getTitles()
    return titles.find(t => (user?.level || 1) < t.level)
  }

  const achievements = [
    { name: 'البداية', desc: 'أكملت أول مهمة', icon: '🎯', unlocked: (user?.totalTasksCompleted || 0) >= 1 },
    { name: 'مثابر', desc: 'أكملت 10 مهام', icon: '💪', unlocked: (user?.totalTasksCompleted || 0) >= 10 },
    { name: 'محترف', desc: 'أكملت 50 مهمة', icon: '🏆', unlocked: (user?.totalTasksCompleted || 0) >= 50 },
    { name: 'سلسلة قوية', desc: '7 أيام متتالية', icon: '🔥', unlocked: (user?.longestStreak || 0) >= 7 },
    { name: 'سلسلة أسطورية', desc: '30 يوم متتالي', icon: '⚡', unlocked: (user?.longestStreak || 0) >= 30 },
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length

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
        جاري التحميل...
      </div>
    )
  }

  const currentTitle = getCurrentTitle()
  const nextTitle = getNextTitle()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F1E',
      direction: 'rtl',
      fontFamily: 'Cairo, sans-serif',
      padding: 24
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <div>
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>🎮 الشخصية</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>تطورك ومستواك</p>
        </div>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'transparent',
            color: '#7A90B0',
            border: '1px solid #1E2D4A',
            borderRadius: 8,
            padding: '8px 16px',
            fontFamily: 'Cairo, sans-serif',
            cursor: 'pointer'
          }}
        >
          ← الرئيسية
        </button>
      </header>

      {/* Character Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 139, 253, 0.1), rgba(0, 230, 255, 0.05))',
        border: '1px solid rgba(56, 139, 253, 0.3)',
        borderRadius: 20,
        padding: 32,
        marginBottom: 24,
        textAlign: 'center'
      }}>
        {/* Avatar */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #388BFD, #00E6FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          margin: '0 auto 16px',
          boxShadow: '0 0 30px rgba(56, 139, 253, 0.4)'
        }}>
          {currentTitle.icon}
        </div>

        <h2 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          {user?.name || 'عبد العزيز'}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{
            background: 'linear-gradient(135deg, #388BFD, #00E6FF)',
            padding: '4px 16px',
            borderRadius: 20,
            color: 'white',
            fontSize: 14,
            fontWeight: 600
          }}>
            LV {user?.level || 1}
          </span>
          <span style={{ color: '#7A90B0', fontSize: 14 }}>{user?.title || currentTitle.title}</span>
        </div>

        {/* XP Bar */}
        <div style={{ maxWidth: 300, margin: '0 auto 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#7A90B0', fontSize: 12 }}>الخبرة</span>
            <span style={{ color: '#00E6FF', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              {user?.xp || 0} / {user?.xpToNextLevel || 100}
            </span>
          </div>
          <div style={{
            background: '#080D18',
            borderRadius: 10,
            height: 16,
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #388BFD, #00E6FF)',
              height: '100%',
              width: `${((user?.xp || 0) / (user?.xpToNextLevel || 100)) * 100}%`,
              borderRadius: 10,
              transition: 'width 0.5s'
            }} />
          </div>
          {nextTitle && (
            <p style={{ color: '#7A90B0', fontSize: 11, marginTop: 8 }}>
              المستوى التالي: {nextTitle.icon} {nextTitle.title} (LV {nextTitle.level})
            </p>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12
        }}>
          {[
            { label: 'المهام', value: user?.totalTasksCompleted || 0, color: '#388BFD' },
            { label: 'السلسلة', value: user?.currentStreak || 0, color: '#FF4560' },
            { label: 'العادات', value: stats.activeHabits, color: '#00E096' },
            { label: 'أفضل سلسلة', value: user?.longestStreak || 0, color: '#C8A03C' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 12,
              padding: 12
            }}>
              <p style={{ color: stat.color, fontSize: 20, fontWeight: 700 }}>{stat.value}</p>
              <p style={{ color: '#7A90B0', fontSize: 11 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          🏆 الإنجازات ({unlockedCount}/{achievements.length})
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12
        }}>
          {achievements.map((ach, i) => (
            <div
              key={i}
              style={{
                background: ach.unlocked ? 'rgba(56, 139, 253, 0.1)' : '#080D18',
                border: `1px solid ${ach.unlocked ? 'rgba(56, 139, 253, 0.3)' : '#1E2D4A'}`,
                borderRadius: 12,
                padding: 16,
                textAlign: 'center',
                opacity: ach.unlocked ? 1 : 0.5
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8, filter: ach.unlocked ? 'none' : 'grayscale(1)' }}>
                {ach.icon}
              </div>
              <p style={{ color: '#E8EDF5', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{ach.name}</p>
              <p style={{ color: '#7A90B0', fontSize: 11 }}>{ach.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
