'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string
  type: string
  amount: number
  category: string
  description?: string
  date: string
}

interface FinanceData {
  transactions: Transaction[]
  income: number
  expenses: number
  balance: number
}

interface Settings {
  savingsGoal: number
}

export default function FinancePage() {
  const router = useRouter()
  const [data, setData] = useState<FinanceData>({ transactions: [], income: 0, expenses: 0, balance: 0 })
  const [settings, setSettings] = useState<Settings>({ savingsGoal: 26000 })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: ''
  })

  const fetchData = useCallback(async () => {
    try {
      const [financeRes, settingsRes] = await Promise.all([
        fetch('/api/finance'),
        fetch('/api/settings')
      ])
      if (financeRes.ok) setData(await financeRes.json())
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

  const createTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.category) return

    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransaction,
          amount: parseFloat(newTransaction.amount)
        })
      })
      if (res.ok) {
        setShowModal(false)
        setNewTransaction({ type: 'expense', amount: '', category: '', description: '' })
        fetchData()
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    }
  }

  const savingsProgress = Math.min((data.balance / settings.savingsGoal) * 100, 100)
  const categories = ['راتب', 'عمل حر', 'هدية', 'طعام', 'مواصلات', 'تسوق', 'تعليم', 'ترفيه', 'أخرى']

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>💰 المالية</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>إدارة أموالك بالشيكل</p>
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
            + معاملة جديدة
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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
          <p style={{ color: '#00E6FF', fontSize: 24, fontWeight: 700 }}>₪{data.balance.toFixed(0)}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>الرصيد</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(0, 224, 150, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#00E096', fontSize: 24, fontWeight: 700 }}>₪{data.income.toFixed(0)}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>الدخل</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(255, 69, 96, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#FF4560', fontSize: 24, fontWeight: 700 }}>₪{data.expenses.toFixed(0)}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>المصاريف</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(200, 160, 60, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#C8A03C', fontSize: 24, fontWeight: 700 }}>₪{settings.savingsGoal}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>الهدف</p>
        </div>
      </div>

      {/* Savings Goal Progress */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(200, 160, 60, 0.2)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 600 }}>🎯 هدف التوفير للصين</h3>
          <span style={{ color: '#C8A03C', fontSize: 14 }}>{savingsProgress.toFixed(1)}%</span>
        </div>
        <div style={{
          background: '#080D18',
          borderRadius: 8,
          height: 16,
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #C8A03C, #FFD700)',
            height: '100%',
            width: `${savingsProgress}%`,
            borderRadius: 8,
            transition: 'width 0.5s'
          }} />
        </div>
        <p style={{ color: '#7A90B0', fontSize: 12, marginTop: 8 }}>
          متبقي ₪{(settings.savingsGoal - data.balance).toFixed(0)} للوصول للهدف
        </p>
      </div>

      {/* Transactions */}
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(56, 139, 253, 0.15)',
        borderRadius: 16,
        padding: 20
      }}>
        <h3 style={{ color: '#E8EDF5', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          📊 آخر المعاملات
        </h3>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {data.transactions.map(tx => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid #1E2D4A'
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: tx.type === 'income' ? 'rgba(0, 224, 150, 0.2)' : 'rgba(255, 69, 96, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
              }}>
                {tx.type === 'income' ? '↓' : '↑'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#E8EDF5', fontSize: 14 }}>{tx.category}</p>
                <p style={{ color: '#7A90B0', fontSize: 12 }}>{tx.description || new Date(tx.date).toLocaleDateString('ar')}</p>
              </div>
              <span style={{
                color: tx.type === 'income' ? '#00E096' : '#FF4560',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {tx.type === 'income' ? '+' : '-'}₪{tx.amount.toFixed(0)}
              </span>
            </div>
          ))}
          {data.transactions.length === 0 && (
            <p style={{ color: '#7A90B0', fontSize: 14, textAlign: 'center', padding: 20 }}>
              لا توجد معاملات بعد
            </p>
          )}
        </div>
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
              معاملة جديدة
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                النوع
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    border: 'none',
                    background: newTransaction.type === 'income' ? '#00E096' : '#080D18',
                    color: newTransaction.type === 'income' ? 'white' : '#7A90B0',
                    cursor: 'pointer',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  دخل
                </button>
                <button
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    border: 'none',
                    background: newTransaction.type === 'expense' ? '#FF4560' : '#080D18',
                    color: newTransaction.type === 'expense' ? 'white' : '#7A90B0',
                    cursor: 'pointer',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  مصروف
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                المبلغ (₪)
              </label>
              <input
                type="number"
                value={newTransaction.amount}
                onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                placeholder="0"
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                الفئة
              </label>
              <select
                value={newTransaction.category}
                onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
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
                <option value="">اختر الفئة</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                وصف (اختياري)
              </label>
              <input
                value={newTransaction.description}
                onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="ملاحظة..."
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
                onClick={createTransaction}
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
