'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface MoodLog {
  id: string
  mood: number
  energy?: number
  stress?: number
  note?: string
  date: string
}

export default function MentalPage() {
  const router = useRouter()
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [loading, setLoading] = useState(true)
  const [todayMood, setTodayMood] = useState({
    mood: 3,
    energy: 3,
    stress: 3,
    note: ''
  })
  const [saved, setSaved] = useState(false)

  const fetchMoods = useCallback(async () => {
    try {
      const res = await fetch('/api/mood?days=30')
      if (res.ok) {
        const logs: MoodLog[] = await res.json()
        setMoodLogs(logs)

        // Check if today's mood exists
        const today = new Date().toISOString().split('T')[0]
        const todayLog = logs.find(l => l.date.split('T')[0] === today)
        if (todayLog) {
          setTodayMood({
            mood: todayLog.mood,
            energy: todayLog.energy || 3,
            stress: todayLog.stress || 3,
            note: todayLog.note || ''
          })
          setSaved(true)
        }
      }
    } catch (error) {
      console.error('Error fetching moods:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMoods()
  }, [fetchMoods])

  const saveMood = async () => {
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todayMood)
      })
      if (res.ok) {
        setSaved(true)
        fetchMoods()
      }
    } catch (error) {
      console.error('Error saving mood:', error)
    }
  }

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊']
  const moodLabels = ['سيء جداً', 'سيء', 'عادي', 'جيد', 'ممتاز']

  const getMoodColor = (mood: number) => {
    const colors = ['#FF4560', '#FFA500', '#7A90B0', '#00E096', '#388BFD']
    return colors[mood - 1] || '#7A90B0'
  }

  // Get last 14 days for calendar
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    return date.toISOString().split('T')[0]
  })

  const avgMood = moodLogs.length
    ? (moodLogs.reduce((sum, l) => sum + l.mood, 0) / moodLogs.length).toFixed(1)
    : '—'

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>🧠 الصحة النفسية</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>تتبع مزاجك وحالتك النفسية</p>
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

      {/* Today's Mood Card */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
          كيف تشعر اليوم؟
        </h3>

        {/* Mood Selection */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: '#7A90B0', fontSize: 13, display: 'block', marginBottom: 12 }}>
            المزاج
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {moodEmojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setTodayMood({ ...todayMood, mood: i + 1 })}
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  border: todayMood.mood === i + 1 ? `2px solid ${getMoodColor(i + 1)}` : '1px solid #1E2D4A',
                  background: todayMood.mood === i + 1 ? `${getMoodColor(i + 1)}20` : '#080D18',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{emoji}</div>
                <div style={{ color: '#7A90B0', fontSize: 10 }}>{moodLabels[i]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Energy & Stress */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 24
        }}>
          <div>
            <label style={{ color: '#7A90B0', fontSize: 13, display: 'block', marginBottom: 8 }}>
              ⚡ الطاقة: {todayMood.energy}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={todayMood.energy}
              onChange={e => setTodayMood({ ...todayMood, energy: parseInt(e.target.value) })}
              style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                appearance: 'none',
                background: `linear-gradient(to left, #00E6FF ${((todayMood.energy - 1) / 4) * 100}%, #1E2D4A 0%)`
              }}
            />
          </div>
          <div>
            <label style={{ color: '#7A90B0', fontSize: 13, display: 'block', marginBottom: 8 }}>
              😰 التوتر: {todayMood.stress}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={todayMood.stress}
              onChange={e => setTodayMood({ ...todayMood, stress: parseInt(e.target.value) })}
              style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                appearance: 'none',
                background: `linear-gradient(to left, #FF4560 ${((todayMood.stress - 1) / 4) * 100}%, #1E2D4A 0%)`
              }}
            />
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: '#7A90B0', fontSize: 13, display: 'block', marginBottom: 8 }}>
            📝 ملاحظة (اختياري)
          </label>
          <textarea
            value={todayMood.note}
            onChange={e => setTodayMood({ ...todayMood, note: e.target.value })}
            placeholder="كيف كان يومك؟"
            rows={3}
            style={{
              width: '100%',
              background: '#080D18',
              border: '1px solid #1E2D4A',
              borderRadius: 8,
              padding: 12,
              color: '#E8EDF5',
              fontFamily: 'Cairo, sans-serif',
              fontSize: 14,
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={saveMood}
          style={{
            width: '100%',
            background: saved ? '#00E096' : '#388BFD',
            border: 'none',
            borderRadius: 10,
            padding: 14,
            color: 'white',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer'
          }}
        >
          {saved ? '✓ تم الحفظ' : 'حفظ'}
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        marginBottom: 24
      }}>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#388BFD', fontSize: 28, fontWeight: 700 }}>{avgMood}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>متوسط المزاج</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#00E096', fontSize: 28, fontWeight: 700 }}>{moodLogs.length}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>يوم مسجل</p>
        </div>
      </div>

      {/* Mood Calendar */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          📅 آخر 14 يوم
        </h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {last14Days.map(date => {
            const log = moodLogs.find(l => l.date.split('T')[0] === date)
            const d = new Date(date)
            const dayName = d.toLocaleDateString('ar', { weekday: 'short' })
            const dayNum = d.getDate()

            return (
              <div
                key={date}
                style={{
                  width: 50,
                  textAlign: 'center',
                  opacity: log ? 1 : 0.4
                }}
              >
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  background: log ? `${getMoodColor(log.mood)}30` : '#080D18',
                  border: `1px solid ${log ? getMoodColor(log.mood) : '#1E2D4A'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  marginBottom: 4
                }}>
                  {log ? moodEmojis[log.mood - 1] : '?'}
                </div>
                <p style={{ color: '#7A90B0', fontSize: 10 }}>{dayName}</p>
                <p style={{ color: '#E8EDF5', fontSize: 12 }}>{dayNum}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
