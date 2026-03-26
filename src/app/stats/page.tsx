'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

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
  daysToTawjihi?: number
  daysToChina?: number
}

interface MoodLog {
  id: string
  mood: number
  date: string
}

export default function StatsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [moods, setMoods] = useState<MoodLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, moodsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/mood?days=7')
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (moodsRes.ok) setMoods(await moodsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  // Simple chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const moodData = last7Days.map(date => {
    const log = moods.find(m => m.date.split('T')[0] === date)
    return {
      day: new Date(date).toLocaleDateString('ar', { weekday: 'short' }),
      mood: log?.mood || 0
    }
  })

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>📊 الإحصاءات</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>نظرة شاملة على تقدمك</p>
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

      {/* Main Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 24
      }}>
        {[
          { label: 'المستوى', value: stats?.level || 1, color: '#388BFD', icon: '🎯' },
          { label: 'المهام المكتملة', value: stats?.tasksCompleted || 0, color: '#00E096', icon: '✅' },
          { label: 'السلسلة', value: `${stats?.streak || 0} يوم`, color: '#FF4560', icon: '🔥' },
          { label: 'الرصيد', value: `₪${stats?.balance || 0}`, color: '#C8A03C', icon: '💰' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#0F172A',
            border: '1px solid rgba(56, 139, 253, 0.15)',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center'
          }}>
            <span style={{ fontSize: 24 }}>{stat.icon}</span>
            <p style={{ color: stat.color, fontSize: 24, fontWeight: 700, marginTop: 8 }}>{stat.value}</p>
            <p style={{ color: '#7A90B0', fontSize: 12 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mood Chart */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          😊 المزاج الأسبوعي
        </h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 150 }}>
          {moodData.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                background: d.mood ? `rgba(56, 139, 253, ${d.mood / 5})` : '#1E2D4A',
                borderRadius: 8,
                height: d.mood ? (d.mood / 5) * 100 : 20,
                minHeight: 20,
                transition: 'height 0.3s'
              }} />
              <p style={{ color: '#7A90B0', fontSize: 10, marginTop: 8 }}>{d.day}</p>
              <p style={{ color: '#388BFD', fontSize: 11 }}>{d.mood || '-'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* XP Progress */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          ⚡ تقدم الخبرة
        </h3>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#7A90B0', fontSize: 12 }}>XP</span>
            <span style={{ color: '#00E6FF', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              {stats?.xp || 0} / {stats?.xpToNext || 100}
            </span>
          </div>
          <div style={{ background: '#080D18', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(90deg, #388BFD, #00E6FF)',
              height: '100%',
              width: `${((stats?.xp || 0) / (stats?.xpToNext || 100)) * 100}%`,
              borderRadius: 8
            }} />
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          📋 نظرة عامة
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1E2D4A' }}>
            <span style={{ color: '#7A90B0', fontSize: 13 }}>مهام معلقة</span>
            <span style={{ color: '#FFA500', fontSize: 13, fontWeight: 600 }}>{stats?.pendingTasks || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1E2D4A' }}>
            <span style={{ color: '#7A90B0', fontSize: 13 }}>عادات نشطة</span>
            <span style={{ color: '#00E096', fontSize: 13, fontWeight: 600 }}>{stats?.activeHabits || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1E2D4A' }}>
            <span style={{ color: '#7A90B0', fontSize: 13 }}>متوسط المزاج</span>
            <span style={{ color: '#388BFD', fontSize: 13, fontWeight: 600 }}>{stats?.avgMood || '-'}/5</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1E2D4A' }}>
            <span style={{ color: '#7A90B0', fontSize: 13 }}>للتوجيهي</span>
            <span style={{ color: '#C8A03C', fontSize: 13, fontWeight: 600 }}>{stats?.daysToTawjihi || '?'} يوم</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1E2D4A' }}>
            <span style={{ color: '#7A90B0', fontSize: 13 }}>للصين</span>
            <span style={{ color: '#00E6FF', fontSize: 13, fontWeight: 600 }}>{stats?.daysToChina || '?'} يوم</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1E2D4A' }}>
            <span style={{ color: '#7A90B0', fontSize: 13 }}>نسبة الإكمال</span>
            <span style={{ color: '#00E096', fontSize: 13, fontWeight: 600 }}>
              {stats?.tasksCompleted ? Math.round((stats.tasksCompleted / (stats.tasksCompleted + (stats.pendingTasks || 0))) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
