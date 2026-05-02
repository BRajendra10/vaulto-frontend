import { NavLink } from 'react-router-dom'
import PublicNav from './PublicNav'

const SECTIONS = [
  {
    label: 'Getting Started',
    links: [
      { to: '/docs', label: 'Introduction', exact: true },
    ],
  },
  {
    label: 'Core Concepts',
    links: [
      { to: '/docs/secrets',      label: 'Secrets & Environments' },
      { to: '/docs/rbac',         label: 'Roles & Access Control' },
      { to: '/docs/security',     label: 'Security Model' },
    ],
  },
  {
    label: 'Integration',
    links: [
      { to: '/docs/api',          label: 'REST API Reference' },
    ],
  },
]

export default function DocsLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0', fontFamily: 'DM Sans, sans-serif' }}>
      <PublicNav />
      <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Sidebar */}
        <aside style={{
          width: 220, flexShrink: 0,
          position: 'sticky', top: 56, height: 'calc(100vh - 56px)',
          overflowY: 'auto', padding: '32px 0 32px',
          borderRight: '1px solid rgba(120,120,180,0.1)',
        }}>
          {SECTIONS.map(section => (
            <div key={section.label} style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.8px',
                textTransform: 'uppercase', color: '#555568',
                padding: '0 16px', marginBottom: 6,
              }}>
                {section.label}
              </div>
              {section.links.map(({ to, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  style={({ isActive }) => ({
                    display: 'block', padding: '7px 16px',
                    fontSize: 13.5, textDecoration: 'none',
                    color: isActive ? '#a394f9' : '#8888a0',
                    background: isActive ? 'rgba(124,106,247,0.08)' : 'transparent',
                    borderRight: isActive ? '2px solid #7c6af7' : '2px solid transparent',
                    transition: 'all 0.12s',
                    fontWeight: isActive ? 500 : 400,
                  })}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '40px 0 80px 56px', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
