'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  getDashboardMetrics,
  getMonthlyData,
  getCategoryData,
  getFeedbackSummary,
  getLowStockItems,
  getTopCustomers,
} from '../../lib/data'
import { useLang } from '../../lib/lang'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

async function fetchAllData() {
  const [metrics, monthlyData, categoryData, feedbackSummary, lowStock, topCustomers] =
    await Promise.all([
      getDashboardMetrics(),
      getMonthlyData(),
      getCategoryData(),
      getFeedbackSummary(),
      getLowStockItems(),
      getTopCustomers(),
    ])
  return { metrics, monthlyData, categoryData, feedbackSummary, lowStock, topCustomers }
}

export default function ChatInterface() {
  const { lang, s } = useLang()
  const [messages, setMessages]         = useState<Message[]>([])
  const [input, setInput]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [recording, setRecording]       = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [speakingIdx, setSpeakingIdx]   = useState<number | null>(null)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef   = useRef<BlobPart[]>([])
  const audioRef    = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(question: string) {
    const q = question.trim()
    if (!q || loading) return

    setInput('')
    const newUserMsg: Message = { role: 'user', content: q }
    setMessages(prev => [...prev, newUserMsg])
    setLoading(true)

    const history = messages

    try {
      const data = await fetchAllData()

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, data, history, language: lang }),
      })

      if (!res.ok) throw new Error('API error')
      const { answer, error: apiError } = await res.json()
      if (apiError) throw new Error(apiError)

      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: s.somethingWentWrong },
      ])
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  // ── Mic / transcribe ──────────────────────────────────────────────────────
  const toggleRecording = useCallback(async () => {
    if (recording) {
      recorderRef.current?.stop()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      const recorder  = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)

      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        setRecording(false)
        setTranscribing(true)
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
          const fd   = new FormData()
          fd.append('file', blob, 'audio.webm')
          const res  = await fetch('/api/transcribe', { method: 'POST', body: fd })
          if (!res.ok) throw new Error()
          const { text } = await res.json()
          if (text) setInput(text)
        } catch { /* user can type manually */ }
        finally { setTranscribing(false); textareaRef.current?.focus() }
      }

      recorder.start()
      recorderRef.current = recorder
      setRecording(true)
    } catch {
      alert('Microphone access denied or unavailable.')
    }
  }, [recording])

  // ── Speak ─────────────────────────────────────────────────────────────────
  async function speakMessage(text: string, idx: number) {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      if (speakingIdx === idx) { setSpeakingIdx(null); return }
    }
    setSpeakingIdx(idx)
    try {
      const res  = await fetch('/api/speak', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setSpeakingIdx(null); URL.revokeObjectURL(url); audioRef.current = null }
      audio.onerror = () => { setSpeakingIdx(null); URL.revokeObjectURL(url); audioRef.current = null }
      await audio.play()
    } catch { setSpeakingIdx(null) }
  }

  const micBusy  = recording || transcribing
  const empty    = messages.length === 0

  return (
    <div style={{
      background: 'rgba(255,252,247,0.8)',
      backdropFilter: 'blur(8px)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(140,70,30,0.06), 0 8px 24px rgba(140,70,30,0.04)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
      }}>
        <span style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'var(--accent-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h9A1.5 1.5 0 0 1 13 2.5v6A1.5 1.5 0 0 1 11.5 10H8l-3 3v-3H2.5A1.5 1.5 0 0 1 1 8.5v-6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        </span>
        <div>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '13.5px', fontWeight: 600,
            color: 'var(--text-hi)', margin: 0,
          }}>{s.askTheAnalyst}</p>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            color: 'var(--text-lo)', margin: 0,
          }}>{s.poweredBy}</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([])
              setSpeakingIdx(null)
              if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
            }}
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
              color: 'var(--text-lo)', background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
              transition: 'color 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-mid)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-lo)')}
          >
            {s.clear}
          </button>
        )}
      </div>

      {/* Messages area */}
      <div style={{
        height: '340px',
        overflowY: 'auto',
        padding: empty ? '24px' : '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>

        {/* Empty state */}
        {empty && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'var(--accent-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)', marginBottom: '14px',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M10 6.5v4M10 13.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '13.5px', fontWeight: 600,
              color: 'var(--text-hi)', margin: '0 0 4px', textAlign: 'center',
            }}>{s.askAboutYourBusiness}</p>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '12px',
              color: 'var(--text-lo)', margin: '0 0 20px', textAlign: 'center',
            }}>{s.queriesRunAgainst}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {s.suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => send(suggestion)}
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: '12px',
                    color: 'var(--text-mid)', background: 'var(--surface-hi)',
                    border: '1px solid var(--border)', borderRadius: '20px',
                    padding: '6px 14px', cursor: 'pointer',
                    transition: 'border-color 0.12s, color 0.12s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-mid)'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}>
            {msg.role === 'assistant' && (
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'var(--accent-dim)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginRight: '6px', marginTop: '2px',
                fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-sans)',
              }}>AI</span>
            )}
            <div style={{
              maxWidth: '70%',
              padding: msg.role === 'user' ? '9px 14px' : '10px 14px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface-hi)',
              color: msg.role === 'user' ? '#FFF8F0' : 'var(--text-hi)',
              fontFamily: 'var(--font-sans)', fontSize: '13.5px',
              lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {msg.content}
            </div>
            {msg.role === 'assistant' && (
              <button
                onClick={() => speakMessage(msg.content, i)}
                title={speakingIdx === i ? 'Stop' : 'Read aloud'}
                style={{
                  marginLeft: '6px', marginTop: '4px', flexShrink: 0,
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: speakingIdx === i ? 'var(--accent-dim)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: speakingIdx === i ? 'var(--accent)' : 'var(--text-lo)',
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)' }}
                onMouseLeave={e => {
                  if (speakingIdx !== i) { e.currentTarget.style.color = 'var(--text-lo)'; e.currentTarget.style.background = 'transparent' }
                }}
              >
                {speakingIdx === i ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                    <rect x="1" y="4" width="2" height="5" rx="1"><animate attributeName="height" values="5;9;5" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="4;2;4" dur="0.8s" repeatCount="indefinite"/></rect>
                    <rect x="4.5" y="2" width="2" height="9" rx="1"><animate attributeName="height" values="9;4;9" dur="0.8s" begin="0.2s" repeatCount="indefinite"/><animate attributeName="y" values="2;4.5;2" dur="0.8s" begin="0.2s" repeatCount="indefinite"/></rect>
                    <rect x="8" y="4" width="2" height="5" rx="1"><animate attributeName="height" values="5;8;5" dur="0.8s" begin="0.1s" repeatCount="indefinite"/><animate attributeName="y" values="4;2.5;4" dur="0.8s" begin="0.1s" repeatCount="indefinite"/></rect>
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M1 4.5h2l3-3v10l-3-3H1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    <path d="M9 4a3.5 3.5 0 0 1 0 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--accent-dim)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-sans)',
            }}>AI</span>
            <div style={{
              padding: '10px 14px',
              background: 'var(--surface-hi)',
              borderRadius: '14px 14px 14px 4px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--text-lo)',
                  display: 'inline-block',
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border)',
        display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0,
        background: 'rgba(255,250,245,0.9)',
      }}>

        {/* Mic button */}
        <button
          onClick={toggleRecording}
          disabled={loading}
          title={recording ? 'Stop recording' : 'Record voice'}
          style={{
            width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
            position: 'relative',
            background: recording ? 'rgba(184,50,50,0.10)' : transcribing ? 'rgba(184,144,42,0.10)' : 'var(--surface-hi)',
            border: `1.5px solid ${recording ? 'rgba(184,50,50,0.35)' : 'var(--border)'}`,
            cursor: loading ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: recording ? '#B83232' : transcribing ? 'var(--gold)' : 'var(--text-mid)',
            transition: 'background 0.15s, border-color 0.15s, color 0.15s',
          }}
        >
          {recording ? (
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#B83232', display: 'block' }} />
          ) : transcribing ? (
            <span style={{
              width: '12px', height: '12px', borderRadius: '50%',
              border: '2px solid var(--border-hi)', borderTopColor: 'var(--gold)',
              animation: 'spin 0.7s linear infinite', display: 'inline-block',
            }} />
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="5" y="1" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M2.5 7.5a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M7.5 12.5v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          )}
          {recording && (
            <span style={{
              position: 'absolute', inset: '-5px', borderRadius: '15px',
              border: '2px solid rgba(184,50,50,0.35)',
              animation: 'pulse-ring 1.2s ease-out infinite',
              pointerEvents: 'none',
            }} />
          )}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={transcribing ? 'Transcribing…' : recording ? 'Recording…' : s.placeholder}
          rows={1}
          disabled={loading || micBusy}
          style={{
            flex: 1, fontFamily: 'var(--font-sans)', fontSize: '13.5px',
            color: 'var(--text-hi)', background: 'var(--surface-hi)',
            border: '1px solid var(--border)', borderRadius: '10px',
            padding: '9px 13px', resize: 'none', outline: 'none',
            lineHeight: 1.5, minHeight: '40px', maxHeight: '120px',
            overflowY: 'auto', transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          onInput={e => {
            const t = e.currentTarget; t.style.height = 'auto'
            t.style.height = `${Math.min(t.scrollHeight, 120)}px`
          }}
        />

        {/* Send button */}
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim() || micBusy}
          style={{
            width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
            background: input.trim() && !loading && !micBusy ? 'var(--accent)' : 'var(--surface-hi)',
            border: '1px solid ' + (input.trim() && !loading && !micBusy ? 'var(--accent)' : 'var(--border)'),
            cursor: input.trim() && !loading && !micBusy ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: input.trim() && !loading && !micBusy ? '#FFF8F0' : 'var(--text-lo)',
            transition: 'background 0.15s, border-color 0.15s, color 0.15s',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M13 7.5L2 2l2.5 5.5L2 13l11-5.5Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
