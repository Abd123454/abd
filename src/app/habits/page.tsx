'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Habit {
  id: string
  name: string
  icon: string
  color: string
  streak: number
  bestStreak: number
  totalCompletions: number
  doneToday: boolean
}

export default function HabitsPage() {
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', icon: '⭕', color: '#388BFD' })

  const fetchHabits = useCallback(async () => {
    try {
      const res = await fetch('/api/habits')
      if (res.ok) {
        setHabits(await res.json())
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const completeHabit = async (habitId: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}/complete`, { method: 'POST' })
      if (res.ok) {
        fetchHabits()
      }
    } catch (error) {
      console.error('Error completing habit:', error)
    }
  }

  const createHabit = async () => {
    if (!newHabit.name.trim()) return

    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit)
      })
      if (res.ok) {
        setShowModal(false)
        setNewHabit({ name: '', icon: '⭕', color: '#388BFD' })
        fetchHabits()
      }
    } catch (error) {
      console.error('Error creating habit:', error)
    }
  }

  const totalStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0)
  const completedToday = habits.filter(h => h.doneToday).length

  const icons = ['⭕', '📚', '💪', '🀄', '🏃', '📖', '✍️', '🎯', '💧', '🧘', '🌅', '🥗', '💤', '📱', '🎮']
  const colors = ['#388BFD', '#FF4560', '#00E096', '#FFA500', '#C8A03C', '#00E6FF', '#A855F7', '#EC4899']

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>⭕ العادات</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>تتبع عاداتك اليومية</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
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
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#388BFD',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + عادة جديدة
          </button>
        </div>
      </header>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
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
          <p style={{ color: '#FF4560', fontSize: 28, fontWeight: 700 }}>🔥 {totalStreak}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>أطول سلسلة</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#00E096', fontSize: 28, fontWeight: 700 }}>{completedToday}/{habits.length}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>مكتملة اليوم</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#00E6FF', fontSize: 28, fontWeight: 700 }}>{habits.reduce((sum, h) => sum + h.totalCompletions, 0)}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>إجمالي الإنجازات</p>
        </div>
      </div>

      {/* Habits Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16
      }}>
        {habits.map(habit => (
          <div
            key={habit.id}
            style={{
              background: '#0F172A',
              border: `1px solid ${habit.doneToday ? 'rgba(0, 224, 150, 0.3)' : 'rgba(56, 139, 253, 0.15)'}`,
              borderRadius: 16,
              padding: 20,
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${habit.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>
                {habit.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 600 }}>{habit.name}</h3>
                <p style={{ color: '#7A90B0', fontSize: 12 }}>🔥 {habit.streak} يوم</p>
              </div>
              <button
                onClick={() => !habit.doneToday && completeHabit(habit.id)}
                disabled={habit.doneToday}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: 'none',
                  background: habit.doneToday ? '#00E096' : habit.color,
                  color: 'white',
                  cursor: habit.doneToday ? 'default' : 'pointer',
                  fontSize: 18,
                  transition: 'all 0.2s'
                }}
              >
                {habit.doneToday ? '✓' : '○'}
              </button>
            </div>

            {/* Streak Progress */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#7A90B0', fontSize: 11 }}>السلسلة الحالية</span>
                <span style={{ color: habit.color, fontSize: 11 }}>أفضل: {habit.bestStreak}</span>
              </div>
              <div style={{
                background: '#080D18',
                borderRadius: 6,
                height: 8,
                overflow: 'hidden'
              }}>
                <div style={{
                  background: habit.color,
                  height: '100%',
                  width: `${Math.min((habit.streak / Math.max(habit.bestStreak, 1)) * 100, 100)}%`,
                  borderRadius: 6,
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            {/* Week Heatmap */}
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: i < habit.streak % 7 ? habit.color : '#1E2D4A'
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: 60,
            color: '#7A90B0'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⭕</div>
            <p style={{ fontSize: 14 }}>لا توجد عادات بعد. أضف عادتك الأولى!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: '#0F172A',
            border: '1px solid rgba(56, 139, 253, 0.3)',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400
          }}>
            <h3 style={{ color: '#E8EDF5', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              عادة جديدة
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                اسم العادة
              </label>
              <input
                value={newHabit.name}
                onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                placeholder="مثال: قراءة 30 دقيقة"
                style={{
                  width: '100%',
                  background: '#080D18',
                  border: '1px solid #1E2D4A',
                  borderRadius: 8,
                  padding: 10,
                  color: '#E8EDF5',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                الأيقونة
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {icons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewHabit({ ...newHabit, icon })}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: newHabit.icon === icon ? '2px solid #388BFD' : '1px solid #1E2D4A',
                      background: newHabit.icon === icon ? 'rgba(56, 139, 253, 0.2)' : '#080D18',
                      fontSize: 16,
                      cursor: 'pointer'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                اللون
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewHabit({ ...newHabit, color })}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: color,
                      border: newHabit.color === color ? '2px solid white' : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid #1E2D4A',
                  borderRadius: 10,
                  padding: 12,
                  color: '#7A90B0',
                  fontFamily: 'Cairo, sans-serif',
                  cursor: 'pointer'
                }}
              >
                إلغاء
              </button>
              <button
                onClick={createHabit}
                style={{
                  flex: 1,
                  background: '#388BFD',
                  border: 'none',
                  borderRadius: 10,
                  padding: 12,
                  color: 'white',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
