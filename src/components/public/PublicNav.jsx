import { Link, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'

const NAV_LINKS = [
  { to: '/docs',               label: 'Docs'      },
  { to: '/docs/secrets',       label: 'Secrets'   },
  { to: '/docs/environments',  label: 'Environments' },
  { to: '/docs/rbac',          label: 'Access Control' },
  { to: '/docs/api',           label: 'API'       },
  { to: '/docs/security',      label: 'Security'  },
]

export default function PublicNav() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(120,120,180,0.12)',
      padding: '0 40px', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #7c6af7, #4f3fdb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={14} color="#fff" />
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, color: '#e8e8f0' }}>
          Vault<span style={{ color: '#a394f9' }}>o</span>
        </span>
        <span style={{
          fontSize: 10, fontFamily: 'DM Mono, monospace',
          background: 'rgba(124,106,247,0.15)', color: '#a394f9',
          border: '1px solid rgba(124,106,247,0.3)',
          padding: '2px 7px', borderRadius: 20, marginLeft: 2,
        }}>docs</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {NAV_LINKS.map(({ to, label }) => {
          const active = pathname === to
          return (
            <Link key={to} to={to} style={{
              padding: '6px 14px', borderRadius: 6,
              fontSize: 13, textDecoration: 'none',
              color: active ? '#a394f9' : '#8888a0',
              background: active ? 'rgba(124,106,247,0.1)' : 'transparent',
              transition: 'all 0.15s',
              fontWeight: active ? 500 : 400,
            }}>
              {label}
            </Link>
          )
        })}
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/login" style={{
          padding: '7px 16px', borderRadius: 7, fontSize: 13,
          color: '#8888a0', textDecoration: 'none',
          border: '1px solid rgba(120,120,180,0.2)',
          transition: 'all 0.15s',
        }}>
          Sign in
        </Link>
        <Link to="/register" style={{
          padding: '7px 16px', borderRadius: 7, fontSize: 13,
          color: '#fff', textDecoration: 'none',
          background: '#7c6af7',
          transition: 'all 0.15s',
        }}>
          Get started
        </Link>
      </div>
    </nav>
  )
}
