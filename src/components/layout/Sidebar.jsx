import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FolderOpen, KeyRound,
  Users, ScrollText, Settings, UserCircle, Lock
} from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import Avatar from '../ui/Avatar'

const NAV = [
  { section: 'Workspace' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderOpen, label: 'Projects' },
  { section: 'Project' },
  { to: '/secrets', icon: KeyRound, label: 'Secrets' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/audit', icon: ScrollText, label: 'Audit Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { section: 'Account' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"><Lock size={16} color="#fff" /></div>
        <span className="logo-text">Vault<span>o</span></span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item, i) => {
          if (item.section) {
            return <div key={i} className="nav-section-label">{item.section}</div>
          }
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={15} className="nav-icon" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-badge" onClick={() => navigate('/profile')}>
          <Avatar name={user?.name || user?.email || 'User'} size={28} />
          <div className="user-info">
            <div className="user-name">{user?.name || user?.email || 'User'}</div>
            <div className="user-role">{user?.role || 'member'}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
