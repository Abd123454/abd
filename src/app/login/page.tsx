'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async () => {
    if (!email || !password) {
      setError('البريد وكلمة المرور مطلوبان')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      const data = await res.json()

      if (data.success) {
        router.push('/')
        router.refresh()
      } else {
        setError(data.error || 'حدث خطأ')
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0F1E 0%, #1a1a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      direction: 'rtl',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      color: '#fff'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #388BFD, #00E6FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 auto 14px',
            boxShadow: '0 8px 32px rgba(56, 139, 253, 0.4)'
          }}>
            م
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>مساري</h1>
          <p style={{ color: '#888', fontSize: '14px' }}>نظام تشغيل حياتك الشخصية</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '28px',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: '600',
                background: mode === 'login' ? '#388BFD' : 'transparent',
                color: mode === 'login' ? 'white' : '#888',
                transition: 'all 0.2s'
              }}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: '600',
                background: mode === 'register' ? '#388BFD' : 'transparent',
                color: mode === 'register' ? 'white' : '#888',
                transition: 'all 0.2s'
              }}
            >
              حساب جديد
            </button>
          </div>

          {/* Form */}
          {mode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#888', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                الاسم
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="عبد العزيز"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#888', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              البريد الإلكتروني
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="email@example.com"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                direction: 'ltr',
                textAlign: 'right'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#888', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              كلمة المرور
            </label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(255, 69, 96, 0.2)',
              border: '1px solid rgba(255, 69, 96, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#FF4560',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #388BFD, #00E6FF)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(56, 139, 253, 0.3)'
            }}
          >
            {loading ? '...' : mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
          </button>

          {/* Demo Account Info */}
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(56, 139, 253, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(56, 139, 253, 0.2)'
          }}>
            <p style={{ color: '#388BFD', fontSize: '13px', marginBottom: '6px' }}>🔑 حساب تجريبي:</p>
            <p style={{ color: '#888', fontSize: '12px' }}>
              البريد: abdelas845@gmail.com<br/>
              كلمة المرور: 123456
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: '#555',
          fontSize: '12px',
          marginTop: '20px'
        }}>
          نظام مساري v2.0 — LIFE OS
        </p>
      </div>
    </div>
  )
}
