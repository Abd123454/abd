'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Subject {
  id: string
  name: string
  studyHours: number
  targetHours: number
  reviewProgress: number
}

interface Settings {
  tawjihiDate: string
}

export default function TawjihiPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [settings, setSettings] = useState<Settings>({ tawjihiDate: '2026-06-15' })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [studyHours, setStudyHours] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const [subjectsRes, settingsRes] = await Promise.all([
        fetch('/api/tawjihi/subjects'),
        fetch('/api/settings')
      ])
      if (subjectsRes.ok) setSubjects(await subjectsRes.json())
      if (settingsRes.ok) setSettings(await settingsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(settings.tawjihiDate).getTime()
      const diff = target - now

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [settings.tawjihiDate])

  const addStudyHours = async () => {
    if (!selectedSubject || !studyHours) return

    try {
      await fetch('/api/tawjihi/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject,
          hours: parseFloat(studyHours)
        })
      })
      setShowModal(false)
      setSelectedSubject('')
      setStudyHours('')
      fetchData()
    } catch (error) {
      console.error('Error adding study hours:', error)
    }
  }

  const totalStudyHours = subjects.reduce((sum, s) => sum + s.studyHours, 0)
  const totalTargetHours = subjects.reduce((sum, s) => sum + s.targetHours, 0)
  const overallProgress = totalTargetHours > 0 ? (totalStudyHours / totalTargetHours) * 100 : 0

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>📚 التوجيهي</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>التحضير للامتحانات النهائية</p>
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
            + ساعات دراسة
          </button>
        </div>
      </header>

      {/* Countdown */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200, 160, 60, 0.1), rgba(200, 160, 60, 0.05))',
        border: '1px solid rgba(200, 160, 60, 0.3)',
        borderRadius: 16,
        padding: 32,
        marginBottom: 24,
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#C8A03C', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          📅 متبقي على التوجيهي
        </h3>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {[
            { label: 'يوم', value: countdown.days },
            { label: 'ساعة', value: countdown.hours },
            { label: 'دقيقة', value: countdown.minutes },
            { label: 'ثانية', value: countdown.seconds }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                background: 'rgba(200, 160, 60, 0.2)',
                borderRadius: 12,
                padding: '16px 20px',
                minWidth: 70
              }}>
                <span style={{ color: '#C8A03C', fontSize: 32, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                  {String(item.value).padStart(2, '0')}
                </span>
              </div>
              <span style={{ color: '#7A90B0', fontSize: 11, marginTop: 6, display: 'block' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 24
      }}>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(200, 160, 60, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#C8A03C', fontSize: 28, fontWeight: 700 }}>{totalStudyHours.toFixed(1)}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>ساعة دراسة</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#388BFD', fontSize: 28, fontWeight: 700 }}>{overallProgress.toFixed(0)}%</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>التقدم الكلي</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(0, 224, 150, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#00E096', fontSize: 28, fontWeight: 700 }}>{subjects.length}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>مواد</p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16
      }}>
        {subjects.map(subject => {
          const progress = (subject.studyHours / subject.targetHours) * 100
          return (
            <div
              key={subject.id}
              style={{
                background: '#0F172A',
                border: '1px solid rgba(200, 160, 60, 0.15)',
                borderRadius: 16,
                padding: 20
              }}
            >
              <h4 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                {subject.name}
              </h4>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#7A90B0', fontSize: 12 }}>
                    {subject.studyHours.toFixed(1)} / {subject.targetHours} ساعة
                  </span>
                  <span style={{ color: '#C8A03C', fontSize: 12 }}>
                    {Math.min(progress, 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{
                  background: '#080D18',
                  borderRadius: 6,
                  height: 8,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: progress >= 100 ? '#00E096' : '#C8A03C',
                    height: '100%',
                    width: `${Math.min(progress, 100)}%`,
                    borderRadius: 6
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7A90B0', fontSize: 11 }}>
                <span>المراجعات: {subject.reviewProgress}%</span>
                {progress < 100 && (
                  <span>متبقي: {(subject.targetHours - subject.studyHours).toFixed(1)} ساعة</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Goal Banner */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(0, 224, 150, 0.2)',
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        textAlign: 'center'
      }}>
        <p style={{ color: '#E8EDF5', fontSize: 16 }}>
          🎯 <strong>الهدف:</strong> المعدل 70%+ للقبول في برامج MIS بالصين
        </p>
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
              إضافة ساعات دراسة
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                المادة
              </label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
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
                <option value="">اختر المادة</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                عدد الساعات
              </label>
              <input
                type="number"
                step="0.5"
                value={studyHours}
                onChange={e => setStudyHours(e.target.value)}
                placeholder="1.5"
                style={{
                  width: '100%',
                  background: '#080D18',
                  border: '1px solid #1E2D4A',
                  borderRadius: 8,
                  padding: 10,
                  color: '#E8EDF5',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 16,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
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
                onClick={addStudyHours}
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
