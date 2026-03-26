'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  category?: string
  xpReward: number
  createdAt: string
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium' as const,
    category: '',
    description: ''
  })
  const [stats, setStats] = useState({ completed: 0, pending: 0, totalXp: 0 })

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks?status=all')
      if (res.ok) {
        const data: Task[] = await res.json()
        setTasks(data)
        setStats({
          completed: data.filter(t => t.status === 'completed').length,
          pending: data.filter(t => t.status === 'pending').length,
          totalXp: data.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.xpReward, 0)
        })
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const completeTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' })
      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const createTask = async () => {
    if (!newTask.title.trim()) return

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
      if (res.ok) {
        setShowModal(false)
        setNewTask({ title: '', priority: 'medium', category: '', description: '' })
        fetchTasks()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#FF4560'
      case 'high': return '#FFA500'
      case 'medium': return '#388BFD'
      case 'low': return '#7A90B0'
      default: return '#7A90B0'
    }
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

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
          <h1 style={{ color: '#E8EDF5', fontSize: 24, fontWeight: 700 }}>📝 المهام</h1>
          <p style={{ color: '#7A90B0', fontSize: 13 }}>إدارة مهامك اليومية</p>
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
            + مهمة جديدة
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
          <p style={{ color: '#FFA500', fontSize: 28, fontWeight: 700 }}>{stats.pending}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>معلقة</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#00E096', fontSize: 28, fontWeight: 700 }}>{stats.completed}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>مكتملة</p>
        </div>
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center'
        }}>
          <p style={{ color: '#00E6FF', fontSize: 28, fontWeight: 700 }}>+{stats.totalXp}</p>
          <p style={{ color: '#7A90B0', fontSize: 12 }}>XP مكتسب</p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: 16
      }}>
        {/* Pending Tasks */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(255, 165, 0, 0.2)',
          borderRadius: 16,
          padding: 20
        }}>
          <h3 style={{ color: '#FFA500', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            ⏳ المعلقة ({pendingTasks.length})
          </h3>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {pendingTasks.map(task => (
              <div
                key={task.id}
                style={{
                  background: '#080D18',
                  border: '1px solid #1E2D4A',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 10
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <button
                    onClick={() => completeTask(task.id)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `2px solid ${getPriorityColor(task.priority)}`,
                      background: 'transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: 2
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#E8EDF5', fontSize: 14, marginBottom: 6 }}>{task.title}</p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{
                        background: `${getPriorityColor(task.priority)}20`,
                        color: getPriorityColor(task.priority),
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 11
                      }}>
                        {task.priority}
                      </span>
                      <span style={{
                        color: '#00E6FF',
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        +{task.xpReward}XP
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FF4560',
                      cursor: 'pointer',
                      fontSize: 16
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <p style={{ color: '#7A90B0', fontSize: 13, textAlign: 'center', padding: 20 }}>
                لا توجد مهام معلقة
              </p>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div style={{
          background: '#0F172A',
          border: '1px solid rgba(0, 224, 150, 0.2)',
          borderRadius: 16,
          padding: 20
        }}>
          <h3 style={{ color: '#00E096', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            ✅ المكتملة ({completedTasks.length})
          </h3>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {completedTasks.slice(0, 10).map(task => (
              <div
                key={task.id}
                style={{
                  background: '#080D18',
                  border: '1px solid #1E2D4A',
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 10,
                  opacity: 0.7
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: '#00E096',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12
                  }}>✓</span>
                  <p style={{ color: '#E8EDF5', fontSize: 14, textDecoration: 'line-through', flex: 1 }}>
                    {task.title}
                  </p>
                  <span style={{
                    color: '#00E6FF',
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    +{task.xpReward}XP
                  </span>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <p style={{ color: '#7A90B0', fontSize: 13, textAlign: 'center', padding: 20 }}>
                لا توجد مهام مكتملة
              </p>
            )}
          </div>
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
              مهمة جديدة
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                العنوان
              </label>
              <input
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="مثال: دراسة الفيزياء"
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
                الأولوية
              </label>
              <select
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
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
                <option value="low">منخفضة (+10 XP)</option>
                <option value="medium">متوسطة (+15 XP)</option>
                <option value="high">عالية (+20 XP)</option>
                <option value="urgent">عاجلة (+25 XP)</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#7A90B0', fontSize: 12, display: 'block', marginBottom: 6 }}>
                الفئة (اختياري)
              </label>
              <input
                value={newTask.category}
                onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                placeholder="مثال: دراسة"
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
                onClick={createTask}
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
