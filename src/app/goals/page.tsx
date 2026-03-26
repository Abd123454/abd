'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Goal {
  id: string
  title: string
  category: string
  progress: number
  status: string
  targetDate?: string
  milestones?: { id: string; title: string; completed: boolean }[]
}

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', category: 'personal' })

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch('/api/goals')
      if (res.ok) setGoals(await res.json())
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const createGoal = async () => {
    if (!newGoal.title.trim()) return

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      })
      if (res.ok) {
        setShowModal(false)
        setNewGoal({ title: '', category: 'personal' })
        fetchGoals()
      }
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      personal: '#388BFD',
      finance: '#00E096',
      travel: '#00E6FF',
      education: '#C8A03C',
      career: '#A855F7',
      health: '#FF4560'
    }
    return colors[category] || '#388BFD'
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      personal: '👤',
      finance: '💰',
      travel: '✈️',
      education: '📚',
      career: '💼',
      health: '💪'
    }
    return icons[category] || '🎯'
  }

  const categories = ['personal', 'finance', 'travel', 'education', 'career', 'health']

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>🎯 الأهداف</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>خطط لمستقبلك</p>
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
            + هدف جديد
          </button>
        </div>
      </header>

      {/* Goals Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16
      }}>
        {goals.map(goal => (
          <div
            key={goal.id}
            style={{
              background: '#0F172A',
              border: `1px solid ${getCategoryColor(goal.category)}30`,
              borderRadius: 16,
              padding: 20
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${getCategoryColor(goal.category)}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>
                {getCategoryIcon(goal.category)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 600 }}>{goal.title}</h3>
                <span style={{
                  color: getCategoryColor(goal.category),
                  fontSize: 12,
                  textTransform: 'capitalize'
                }}>
                  {goal.category}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#7A90B0', fontSize: 12 }}>التقدم</span>
                <span style={{ color: getCategoryColor(goal.category), fontSize: 12 }}>{goal.progress}%</span>
              </div>
              <div style={{
                background: '#080D18',
                borderRadius: 8,
                height: 10,
                overflow: 'hidden'
              }}>
                <div style={{
                  background: getCategoryColor(goal.category),
                  height: '100%',
                  width: `${goal.progress}%`,
                  borderRadius: 8,
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            {goal.targetDate && (
              <p style={{ color: '#7A90B0', fontSize: 12 }}>
                📅 {new Date(goal.targetDate).toLocaleDateString('ar')}
              </p>
            )}
          </div>
        ))}

        {goals.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: 60,
            color: '#7A90B0'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <p style={{ fontSize: 14 }}>لا توجد أهداف بعد. أضف هدفك الأول!</p>
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
              هدف جديد
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                العنوان
              </label>
              <input
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="مثال: تعلم لغة جديدة"
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

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                الفئة
              </label>
              <select
                value={newGoal.category}
                onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
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
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{getCategoryIcon(cat)} {cat}</option>
                ))}
              </select>
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
                onClick={createGoal}
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
