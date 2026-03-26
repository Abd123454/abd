'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  title: string
}

interface Settings {
  savingsGoal: number
  tawjihiDate: string
  chinaDate: string
  notifications: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettings] = useState<Settings>({
    savingsGoal: 26000,
    tawjihiDate: '2026-06-15',
    chinaDate: '2026-09-01',
    notifications: true
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [userRes, settingsRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/settings')
      ])
      if (userRes.ok) setUser(await userRes.json())
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

  const updateUser = async () => {
    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const updateSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const exportData = async () => {
    try {
      const [userData, tasksData, habitsData, financeData, goalsData] = await Promise.all([
        fetch('/api/user').then(r => r.json()),
        fetch('/api/tasks?status=all').then(r => r.json()),
        fetch('/api/habits').then(r => r.json()),
        fetch('/api/finance').then(r => r.json()),
        fetch('/api/goals').then(r => r.json())
      ])

      const exportObj = {
        user: userData,
        tasks: tasksData,
        habits: habitsData,
        finance: financeData,
        goals: goalsData,
        exportedAt: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `masari-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
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
        جاري التحميل...
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    background: '#080D18',
    border: '1px solid #1E2D4A',
    borderRadius: 8,
    padding: 10,
    color: '#E8EDF5',
    fontFamily: 'Cairo, sans-serif',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const
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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>⚙️ الإعدادات</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>تخصيص تجربتك</p>
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

      {/* Profile Settings */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          👤 الملف الشخصي
        </h3>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
            الاسم
          </label>
          <input
            value={user?.name || ''}
            onChange={e => setUser(prev => prev ? { ...prev, name: e.target.value } : null)}
            onBlur={updateUser}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
            اللقب
          </label>
          <input
            value={user?.title || ''}
            onChange={e => setUser(prev => prev ? { ...prev, title: e.target.value } : null)}
            onBlur={updateUser}
            placeholder="مثال: مطور طموح"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Goals Settings */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          🎯 الأهداف
        </h3>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
            هدف التوفير (₪)
          </label>
          <input
            type="number"
            value={settings.savingsGoal}
            onChange={e => setSettings({ ...settings, savingsGoal: parseInt(e.target.value) || 26000 })}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
            تاريخ التوجيهي
          </label>
          <input
            type="date"
            value={settings.tawjihiDate}
            onChange={e => setSettings({ ...settings, tawjihiDate: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
            تاريخ السفر للصين
          </label>
          <input
            type="date"
            value={settings.chinaDate}
            onChange={e => setSettings({ ...settings, chinaDate: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={updateSettings}
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
          cursor: 'pointer',
          marginBottom: 16
        }}
      >
        {saved ? '✓ تم الحفظ' : 'حفظ الإعدادات'}
      </button>

      {/* Export Data */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          📦 البيانات
        </h3>
        <button
          onClick={exportData}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid #1E2D4A',
            borderRadius: 10,
            padding: 12,
            color: '#E8EDF5',
            fontFamily: 'Cairo, sans-serif',
            cursor: 'pointer'
          }}
        >
          📥 تصدير البيانات (JSON)
        </button>
      </div>

      {/* Danger Zone */}
      <div style={{
        background: 'rgba(255, 69, 96, 0.1)',
        border: '1px solid rgba(255, 69, 96, 0.3)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16
      }}>
        <h3 style={{ color: '#FF4560', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          ⚠️ منطقة الخطر
        </h3>
        <button
          onClick={logout}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid #FF4560',
            borderRadius: 10,
            padding: 12,
            color: '#FF4560',
            fontFamily: 'Cairo, sans-serif',
            cursor: 'pointer'
          }}
        >
          تسجيل الخروج
        </button>
      </div>

      {/* Version */}
      <p style={{
        textAlign: 'center',
        color: '#5A6A8A',
        fontSize: 12,
        marginTop: 24
      }}>
        نظام مساري v2.0 — LIFE OS
      </p>
    </div>
  )
}
