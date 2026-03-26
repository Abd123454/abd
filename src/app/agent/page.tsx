'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from 'ai/react'

interface AgentLog {
  id: string
  type: string
  content: string
  createdAt: string
}

interface Memory {
  id: string
  type: string
  content: string
  importance: number
}

export default function AgentPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'thoughts' | 'tasks' | 'memory'>('thoughts')
  const [logs, setLogs] = useState<AgentLog[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/agent'
  })

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/agent/logs?limit=50')
        if (res.ok) {
          setLogs(await res.json())
        }
      } catch (error) {
        console.error('Error fetching logs:', error)
      }
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 3000)
    return () => clearInterval(interval)
  }, [isLoading])

  // Fetch memories
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch('/api/agent/memories')
        if (res.ok) {
          setMemories(await res.json())
        }
      } catch (error) {
        console.error('Error fetching memories:', error)
      }
    }

    fetchMemories()
  }, [])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getLogColor = (type: string) => {
    switch (type) {
      case 'thought': return '#388BFD'
      case 'action': return '#00E6FF'
      case 'result': return '#00E096'
      case 'error': return '#FF4560'
      default: return '#7A90B0'
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'thought': return '💭'
      case 'action': return '⚡'
      case 'result': return '✅'
      case 'error': return '❌'
      default: return '•'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F1E',
      direction: 'rtl',
      fontFamily: 'Cairo, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #1E2D4A',
        background: '#0F172A'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #388BFD, #00E6FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18
          }}>
            🤖
          </div>
          <div>
            <h1 style={{ color: '#E8EDF5', fontSize: 18, fontWeight: 700 }}>الوكيل الذكي</h1>
            <p style={{ color: '#7A90B0', fontSize: 12 }}>مساعدك الشخصي</p>
          </div>
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

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        height: 'calc(100vh - 73px)'
      }}>
        {/* Chat Section */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: 60,
                color: '#7A90B0'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                <h3 style={{ color: '#E8EDF5', fontSize: 18, marginBottom: 8 }}>مرحباً!</h3>
                <p style={{ fontSize: 14 }}>أنا الوكيل الذكي. كيف أقدر أساعدك اليوم؟</p>
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['أضف مهمة جديدة', 'ما رصيدي المالي؟', 'سجّل مزاجي اليوم', 'أرني إحصائياتي'].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const event = { target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>
                        handleInputChange(event)
                      }}
                      style={{
                        background: '#0F172A',
                        border: '1px solid #1E2D4A',
                        borderRadius: 10,
                        padding: 12,
                        color: '#E8EDF5',
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-start' : 'flex-end'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  background: message.role === 'user' ? '#388BFD' : '#0F172A',
                  border: message.role === 'user' ? 'none' : '1px solid #1E2D4A',
                  borderRadius: 16,
                  padding: 16,
                  borderBottomRightRadius: message.role === 'user' ? 4 : 16,
                  borderBottomLeftRadius: message.role === 'user' ? 16 : 4
                }}>
                  <p style={{
                    color: 'white',
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {typeof message.content === 'string'
                      ? message.content
                      : Array.isArray(message.content)
                        ? message.content.map(part => typeof part === 'string' ? part : '').join('')
                        : ''}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <div style={{
                  background: '#0F172A',
                  border: '1px solid #1E2D4A',
                  borderRadius: 16,
                  borderBottomLeftRadius: 4,
                  padding: 16
                }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        style={{
                          width: 8,
                          height: 8,
                          background: '#388BFD',
                          borderRadius: '50%',
                          animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 16,
              borderTop: '1px solid #1E2D4A',
              background: '#0F172A'
            }}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="اكتب رسالتك..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: '#080D18',
                  border: '1px solid #1E2D4A',
                  borderRadius: 12,
                  padding: 14,
                  color: '#E8EDF5',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: 14,
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  background: '#388BFD',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 24px',
                  color: 'white',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: isLoading || !input.trim() ? 0.6 : 1
                }}
              >
                إرسال
              </button>
            </div>
          </form>
        </div>

        {/* Divider */}
        <div style={{ background: '#1E2D4A' }} />

        {/* Workspace Section */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#080D18' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #1E2D4A',
            padding: '8px 16px',
            gap: 4
          }}>
            {[
              { id: 'thoughts', label: 'تدفق التفكير', icon: '💭' },
              { id: 'memory', label: 'الذاكرة', icon: '🧠' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'thoughts' | 'tasks' | 'memory')}
                style={{
                  background: activeTab === tab.id ? 'rgba(56, 139, 253, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  color: activeTab === tab.id ? '#388BFD' : '#7A90B0',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {activeTab === 'thoughts' && (
              <div>
                <h4 style={{ color: '#E8EDF5', fontSize: 14, marginBottom: 16 }}>سجل التفكير</h4>
                {logs.length === 0 ? (
                  <p style={{ color: '#7A90B0', fontSize: 13, textAlign: 'center', padding: 20 }}>
                    لا توجد سجلات بعد
                  </p>
                ) : (
                  logs.map(log => (
                    <div
                      key={log.id}
                      style={{
                        background: '#0F172A',
                        border: '1px solid #1E2D4A',
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 8
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span>{getLogIcon(log.type)}</span>
                        <span style={{
                          color: getLogColor(log.type),
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {log.type}
                        </span>
                      </div>
                      <p style={{ color: '#E8EDF5', fontSize: 13 }}>{log.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'memory' && (
              <div>
                <h4 style={{ color: '#E8EDF5', fontSize: 14, marginBottom: 16 }}>الذاكرة طويلة المدى</h4>
                {memories.length === 0 ? (
                  <p style={{ color: '#7A90B0', fontSize: 13, textAlign: 'center', padding: 20 }}>
                    لا توجد ذكريات بعد
                  </p>
                ) : (
                  memories.map(memory => (
                    <div
                      key={memory.id}
                      style={{
                        background: '#0F172A',
                        border: '1px solid #1E2D4A',
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 8
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{
                          background: 'rgba(56, 139, 253, 0.2)',
                          color: '#388BFD',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontSize: 11
                        }}>
                          {memory.type}
                        </span>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              style={{
                                width: 4,
                                height: 12,
                                background: i <= memory.importance ? '#388BFD' : '#1E2D4A',
                                borderRadius: 2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: '#E8EDF5', fontSize: 13 }}>{memory.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
