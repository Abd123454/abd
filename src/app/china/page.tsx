'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface ChineseWord {
  id: string
  chinese: string
  pinyin: string
  arabic: string
  hskLevel: number
  mastered: boolean
  timesReviewed: number
}

interface ChinaData {
  words: ChineseWord[]
  total: number
  mastered: number
}

interface FinanceData {
  balance: number
}

interface Settings {
  chinaDate: string
  savingsGoal: number
}

export default function ChinaPage() {
  const router = useRouter()
  const [chinaData, setChinaData] = useState<ChinaData>({ words: [], total: 0, mastered: 0 })
  const [finance, setFinance] = useState<FinanceData>({ balance: 0 })
  const [settings, setSettings] = useState<Settings>({ chinaDate: '2026-09-01', savingsGoal: 26000 })
  const [loading, setLoading] = useState(true)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [wordsRes, financeRes, settingsRes] = await Promise.all([
        fetch('/api/chinese/words'),
        fetch('/api/finance'),
        fetch('/api/settings')
      ])
      if (wordsRes.ok) setChinaData(await wordsRes.json())
      if (financeRes.ok) setFinance(await financeRes.json())
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
      const target = new Date(settings.chinaDate).getTime()
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
  }, [settings.chinaDate])

  const markMastered = async (wordId: string, mastered: boolean) => {
    try {
      await fetch('/api/chinese/words', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wordId, mastered })
      })
      fetchData()
    } catch (error) {
      console.error('Error updating word:', error)
    }
  }

  const deadlines = [
    { name: 'جواز السفر', date: '2026-04-01', icon: '🛂' },
    { name: 'تقديم CSC', date: '2026-05-01', icon: '📋' },
    { name: 'الشهادات', date: '2026-05-15', icon: '📄' },
    { name: 'التأشيرة', date: '2026-07-01', icon: '✈️' }
  ]

  const checklist = [
    { name: 'إكمال التوجيهي بنجاح', done: true },
    { name: 'توفير المبلغ المطلوب', done: false },
    { name: 'إصدار جواز السفر', done: false },
    { name: 'التقديم للمنحة', done: false },
    { name: 'الحصول على التأشيرة', done: false },
    { name: 'حجز التذاكر', done: false }
  ]

  const savingsProgress = Math.min((finance.balance / settings.savingsGoal) * 100, 100)
  const unmasteredWords = chinaData.words.filter(w => !w.mastered)

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>✈️ خطة الصين</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>التحضير للدراسة في الصين</p>
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

      {/* Countdown */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 230, 255, 0.1), rgba(0, 230, 255, 0.05))',
        border: '1px solid rgba(0, 230, 255, 0.3)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#00E6FF', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          🇨🇳 متبقي على السفر
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
                background: 'rgba(0, 230, 255, 0.2)',
                borderRadius: 12,
                padding: '16px 20px',
                minWidth: 70
              }}>
                <span style={{ color: '#00E6FF', fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                  {String(item.value).padStart(2, '0')}
                </span>
              </div>
              <span style={{ color: '#7A90B0', fontSize: 11, marginTop: 6, display: 'block' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {/* Deadlines */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 16,
          padding: 20
        }}>
          <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            📅 مواعيد حرجة
          </h3>
          {deadlines.map((d, i) => {
            const daysLeft = Math.ceil((new Date(d.date).getTime() - Date.now()) / 86400000)
            const isUrgent = daysLeft < 30 && daysLeft > 0
            const isPast = daysLeft < 0

            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid #1E2D4A'
              }}>
                <span style={{ fontSize: 24 }}>{d.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#E8EDF5', fontSize: 14 }}>{d.name}</p>
                  <p style={{ color: '#7A90B0', fontSize: 12 }}>{new Date(d.date).toLocaleDateString('ar')}</p>
                </div>
                <span style={{
                  color: isPast ? '#7A90B0' : isUrgent ? '#FF4560' : '#00E096',
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {isPast ? 'انتهى' : `${daysLeft} يوم`}
                </span>
              </div>
            )
          })}
        </div>

        {/* Checklist */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 16,
          padding: 20
        }}>
          <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            ✓ قائمة التحضير
          </h3>
          {checklist.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 0',
              borderBottom: '1px solid #1E2D4A'
            }}>
              <span style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: item.done ? '#00E096' : '#080D18',
                border: item.done ? 'none' : '1px solid #1E2D4A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 12
              }}>
                {item.done ? '✓' : ''}
              </span>
              <p style={{ color: item.done ? '#7A90B0' : '#E8EDF5', fontSize: 14, textDecoration: item.done ? 'line-through' : 'none' }}>
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Progress */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(200, 160, 60, 0.2)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          💰 التوفير للصين
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#7A90B0', fontSize: 14 }}>₪{finance.balance.toFixed(0)} / ₪{settings.savingsGoal}</span>
          <span style={{ color: '#C8A03C', fontSize: 14 }}>{savingsProgress.toFixed(1)}%</span>
        </div>
        <div style={{ background: '#080D18', borderRadius: 8, height: 12, overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(90deg, #C8A03C, #FFD700)',
            height: '100%',
            width: `${savingsProgress}%`,
            borderRadius: 8
          }} />
        </div>
      </div>

      {/* Chinese Words */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(255, 69, 96, 0.2)',
        borderRadius: 16,
        padding: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700 }}>
            🀄 تعلم الصينية
          </h3>
          <span style={{ color: '#7A90B0', fontSize: 12 }}>
            {chinaData.mastered}/{chinaData.total} كلمة
          </span>
        </div>

        {unmasteredWords.length > 0 ? (
          <div>
            {/* Flashcard */}
            <div
              onClick={() => setShowAnswer(!showAnswer)}
              style={{
                background: showAnswer ? 'rgba(255, 69, 96, 0.1)' : '#080D18',
                border: `1px solid ${showAnswer ? 'rgba(255, 69, 96, 0.3)' : '#1E2D4A'}`,
                borderRadius: 16,
                padding: 32,
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: 16
              }}
            >
              <p style={{
                color: '#E8EDF5',
                fontSize: 48,
                fontWeight: 700,
                marginBottom: 12,
                fontFamily: 'serif'
              }}>
                {unmasteredWords[currentWordIndex]?.chinese}
              </p>
              <p style={{ color: '#7A90B0', fontSize: 16, marginBottom: 8 }}>
                {unmasteredWords[currentWordIndex]?.pinyin}
              </p>
              {showAnswer && (
                <p style={{ color: '#00E6FF', fontSize: 24, fontWeight: 600 }}>
                  {unmasteredWords[currentWordIndex]?.arabic}
                </p>
              )}
              {!showAnswer && (
                <p style={{ color: '#5A6A8A', fontSize: 14 }}>اضغط للإجابة</p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  setShowAnswer(false)
                  setCurrentWordIndex((currentWordIndex + 1) % unmasteredWords.length)
                }}
                style={{
                  flex: 1,
                  background: '#080D18',
                  border: '1px solid #1E2D4A',
                  borderRadius: 10,
                  padding: 12,
                  color: '#7A90B0',
                  fontFamily: 'Cairo, sans-serif',
                  cursor: 'pointer'
                }}
              >
                التالي →
              </button>
              <button
                onClick={() => markMastered(unmasteredWords[currentWordIndex].id, true)}
                style={{
                  flex: 1,
                  background: '#00E096',
                  border: 'none',
                  borderRadius: 10,
                  padding: 12,
                  color: 'white',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ✓ أتقنتها
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: '#7A90B0', fontSize: 14, textAlign: 'center', padding: 20 }}>
            🎉 أتقنت كل الكلمات!
          </p>
        )}
      </div>
    </div>
  )
}
