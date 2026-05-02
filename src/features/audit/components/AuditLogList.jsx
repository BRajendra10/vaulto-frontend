import { useEffect, useState } from 'react'
import { useAuditLogs } from '../hooks/useAudit'
import { Skeleton } from '../../../components/ui/Skeleton'
import { formatRelative } from '../../../lib/utils'

const ACTION_ICONS = {
  SECRET_CREATE:      { icon: '➕', bg: 'var(--green-bg)',  color: 'var(--green)'  },
  SECRET_REVEAL:      { icon: '👁',  bg: 'var(--blue-bg)',   color: 'var(--blue)'   },
  SECRET_ROTATE:      { icon: '🔄', bg: 'var(--amber-bg)',  color: 'var(--amber)'  },
  SECRET_DELETE:      { icon: '🗑',  bg: 'var(--red-bg)',    color: 'var(--red)'    },
  SECRET_UPDATE:      { icon: '✏️', bg: 'var(--accent-bg)', color: 'var(--accent2)'},
  MEMBER_ADD:         { icon: '👥', bg: 'var(--accent-bg)', color: 'var(--accent2)'},
  MEMBER_REMOVE:      { icon: '🚫', bg: 'var(--red-bg)',    color: 'var(--red)'    },
  MEMBER_ROLE_UPDATE: { icon: '🔑', bg: 'var(--blue-bg)',   color: 'var(--blue)'   },
  PROJECT_CREATE:     { icon: '📁', bg: 'var(--green-bg)',  color: 'var(--green)'  },
  PROJECT_UPDATE:     { icon: '⚙️', bg: 'var(--amber-bg)',  color: 'var(--amber)'  },
}

const DEFAULT = { icon: '📋', bg: 'rgba(120,120,140,0.1)', color: 'var(--text2)' }

const ACTION_OPTIONS = [
  { value: '',              label: 'All actions'     },
  { value: 'SECRET_CREATE', label: 'Secret created'  },
  { value: 'SECRET_REVEAL', label: 'Secret revealed' },
  { value: 'SECRET_ROTATE', label: 'Secret rotated'  },
  { value: 'SECRET_DELETE', label: 'Secret deleted'  },
  { value: 'MEMBER_ADD',    label: 'Member added'    },
  { value: 'MEMBER_REMOVE', label: 'Member removed'  },
]

export default function AuditLogList({ projectId }) {
  const [action, setAction] = useState('')
  const [from, setFrom]     = useState('')
  const [to, setTo]         = useState('')

  const params = {
    action: action || undefined,
    from:   from   || undefined,
    to:     to     || undefined,
  }

  const { data: list, isLoading, load } = useAuditLogs(projectId, params)

  // load on mount and whenever filters change
  useEffect(() => { load() }, [load])

  const formatAction = (log) => {
    const actor    = `<strong>${log.actor?.email || log.user?.email || 'Someone'}</strong>`
    const resource = log.resourceKey || log.resourceName
      ? `<strong>${log.resourceKey || log.resourceName}</strong>` : ''
    const map = {
      SECRET_CREATE:      `${actor} created secret ${resource}`,
      SECRET_REVEAL:      `${actor} revealed secret ${resource}`,
      SECRET_ROTATE:      `${actor} rotated secret ${resource}`,
      SECRET_DELETE:      `${actor} deleted secret ${resource}`,
      SECRET_UPDATE:      `${actor} updated secret ${resource}`,
      MEMBER_ADD:         `${actor} added member ${resource}`,
      MEMBER_REMOVE:      `${actor} removed member ${resource}`,
      MEMBER_ROLE_UPDATE: `${actor} updated role for ${resource}`,
      PROJECT_CREATE:     `${actor} created project ${resource}`,
      PROJECT_UPDATE:     `${actor} updated project settings`,
    }
    return map[log.action] || `${actor} performed ${log.action}`
  }

  return (
    <>
      <div className="filter-bar">
        <select
          className="form-select" style={{ width: 'auto' }}
          value={action} onChange={e => { setAction(e.target.value) }}
        >
          {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <input type="date" className="form-input" style={{ width: 'auto' }}
          value={from} onChange={e => setFrom(e.target.value)} />
        <span style={{ color: 'var(--text3)', fontSize: 12 }}>to</span>
        <input type="date" className="form-input" style={{ width: 'auto' }}
          value={to} onChange={e => setTo(e.target.value)} />

        {(action || from || to) && (
          <button className="btn btn-ghost btn-sm"
            onClick={() => { setAction(''); setFrom(''); setTo('') }}>
            Clear
          </button>
        )}
      </div>

      <div className="card">
        <div style={{ padding: '0 20px' }}>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(120,120,180,0.05)' }}>
                <Skeleton width={32} height={32} style={{ borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="80%" height={13} style={{ marginBottom: 6 }} />
                  <Skeleton width={80} height={11} />
                </div>
              </div>
            ))
          ) : list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No audit logs</div>
              <div className="empty-desc">Activity will appear here as your team uses the vault</div>
            </div>
          ) : (
            list.map((log, i) => {
              const { icon, bg, color } = ACTION_ICONS[log.action] || DEFAULT
              return (
                <div key={log.id || log._id || i} className="audit-item">
                  <div className="audit-icon" style={{ background: bg, color }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                  </div>
                  <div className="audit-content">
                    <div className="audit-action" dangerouslySetInnerHTML={{ __html: formatAction(log) }} />
                    <div className="audit-time">{formatRelative(log.createdAt || log.timestamp)}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
