'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Component {
  id: string
  name: string
  type: string
  status: string
  notes?: string
}

export default function ATSPage() {
  const router = useRouter()
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComponents = useCallback(async () => {
    try {
      const res = await fetch('/api/ats/components')
      if (res.ok) setComponents(await res.json())
    } catch (error) {
      console.error('Error fetching components:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComponents()
  }, [fetchComponents])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/ats/components', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      fetchComponents()
    } catch (error) {
      console.error('Error updating component:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return '#00E096'
      case 'testing': return '#388BFD'
      case 'failed': return '#FF4560'
      default: return '#7A90B0'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'working': return 'يعمل'
      case 'testing': return 'اختبار'
      case 'failed': return 'فشل'
      default: return 'معلق'
    }
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      contactor: '⚡',
      timer: '⏱️',
      relay: '🔌',
      switch: '🔘',
      breaker: '🔒'
    }
    return icons[type] || '🔧'
  }

  const workingCount = components.filter(c => c.status === 'working').length
  const progress = components.length > 0 ? (workingCount / components.length) * 100 : 0

  const statuses = ['pending', 'testing', 'working', 'failed']

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>⚡ لوحة ATS</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>مشروع التخرج - نظام التحويل التلقائي</p>
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

      {/* Progress */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700 }}>التقدم الكلي</h3>
          <span style={{ color: '#00E6FF', fontSize: 20, fontWeight: 700 }}>{progress.toFixed(0)}%</span>
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
            width: `${progress}%`,
            borderRadius: 8,
            transition: 'width 0.5s'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, color: '#7A90B0', fontSize: 12 }}>
          <span>✅ {workingCount} يعمل</span>
          <span>🔧 {components.length} مكوّن</span>
        </div>
      </div>

      {/* Components Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 16
      }}>
        {components.map(component => (
          <div
            key={component.id}
            style={{
              background: '#0F172A',
              border: `1px solid ${getStatusColor(component.status)}30`,
              borderRadius: 16,
              padding: 20
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: `${getStatusColor(component.status)}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20
              }}>
                {getTypeIcon(component.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#E8EDF5', fontSize: 14, fontWeight: 600 }}>{component.name}</h4>
                <p style={{ color: '#7A90B0', fontSize: 11 }}>{component.type}</p>
              </div>
              <span style={{
                background: `${getStatusColor(component.status)}20`,
                color: getStatusColor(component.status),
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600
              }}>
                {getStatusLabel(component.status)}
              </span>
            </div>

            {component.notes && (
              <p style={{ color: '#7A90B0', fontSize: 12, marginBottom: 12 }}>{component.notes}</p>
            )}

            <select
              value={component.status}
              onChange={e => updateStatus(component.id, e.target.value)}
              style={{
                width: '100%',
                background: '#080D18',
                border: '1px solid #1E2D4A',
                borderRadius: 8,
                padding: 8,
                color: '#E8EDF5',
                fontFamily: 'Cairo, sans-serif',
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{getStatusLabel(s)}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Info */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginTop: 24
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          📋 وصف المشروع
        </h3>
        <p style={{ color: '#7A90B0', fontSize: 14, lineHeight: 1.6 }}>
          لوحة ATS (Automatic Transfer Switch) - نظام تحويل تلقائي بين مصدرين للكهرباء (الشبكة والمولد).
          يتضمن قواطع KM1 و KM2، مؤقتات T1 و T2، مرحل مراقبة الجهد، ومفاتيح التحكم.
        </p>
      </div>
    </div>
  )
}
