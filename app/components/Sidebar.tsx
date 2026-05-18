'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '../../lib/lang'

export default function Sidebar() {
  const pathname = usePathname()
  const { s } = useLang()

  const navItems = [
    {
      label: s.navDashboard,
      href: '/',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="9.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="1" y="9.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      ),
    },
    {
      label: s.navAnalytics,
      href: '/analytics',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="8.5" width="3" height="6.5" rx="0.8" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="6.5" y="4.5" width="3" height="10.5" rx="0.8" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="12" y="1" width="3" height="14" rx="0.8" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      ),
    },
    {
      label: s.navReports,
      href: '/reports',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
          <line x1="5" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="5" y1="10.5" x2="8.5" y2="10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: s.navDocuments,
      href: '/documents',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4C2 2.9 2.9 2 4 2H9L14 7V13C14 14.1 13.1 15 12 15H4C2.9 15 2 14.1 2 13V4Z" stroke="currentColor" strokeWidth="1.4"/>
          <polyline points="9,2 9,7 14,7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: s.navNewEntry,
      href: '/add-sale',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M8 5.5V10.5M5.5 8H10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: s.navSettings,
      href: '/settings',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2.3" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M8 1.5V3M8 13V14.5M1.5 8H3M13 8H14.5M3.05 3.05L4.1 4.1M11.9 11.9L12.95 12.95M12.95 3.05L11.9 4.1M4.1 11.9L3.05 12.95" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="brand-glyph">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="4.1" y1="4.1" x2="15.9" y2="15.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="15.9" y1="4.1" x2="4.1" y2="15.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
        <span className="brand-name">Nexus</span>
      </div>

      <div className="sidebar-divider" />

      <span className="nav-section-label">{s.menu}</span>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
            >
              <span className="nav-indicator" />
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="nav-active-dot" />}
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <div className="status-row">
          <span className="status-dot" />
          <span className="status-text">{s.systemOnline}</span>
        </div>
      </div>
    </aside>
  )
}
