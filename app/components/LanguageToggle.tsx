'use client'

import { useLang } from '../../lib/lang'
import type { Lang } from '../../lib/lang'

export default function LanguageToggle() {
  const { lang, setLang } = useLang()

  const base: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  }

  const active: React.CSSProperties = {
    background: 'rgba(255,255,255,0.9)',
    color: 'var(--accent)',
  }

  const inactive: React.CSSProperties = {
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      background: 'rgba(0,0,0,0.12)',
      borderRadius: '8px',
      padding: '3px',
    }}>
      {(['en', 'ar'] as Lang[]).map(l => (
        <button
          key={l}
          style={{ ...base, ...(lang === l ? active : inactive) }}
          onClick={() => setLang(l)}
        >
          {l === 'en' ? 'English' : 'العربية'}
        </button>
      ))}
    </div>
  )
}
