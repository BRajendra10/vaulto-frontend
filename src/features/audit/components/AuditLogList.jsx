import { useEffect, useState } from 'react'
import { useAuditLogs } from '../hooks/useAudit'
import { Skeleton } from '../../../components/ui/Skeleton'
import { formatRelative } from '../../../lib/utils'

const ACTION_ICONS = {
  'secret.created': {
    icon: '➕',
    bg: 'var(--green-bg)',
    color: 'var(--green)',
  },

  'secret.revealed': {
    icon: '👁',
    bg: 'var(--blue-bg)',
    color: 'var(--blue)',
  },

  'secret.rotated': {
    icon: '🔄',
    bg: 'var(--amber-bg)',
    color: 'var(--amber)',
  },

  'secret.deleted': {
    icon: '🗑',
    bg: 'var(--red-bg)',
    color: 'var(--red)',
  },

  'secret.updated': {
    icon: '✏️',
    bg: 'var(--accent-bg)',
    color: 'var(--accent2)',
  },

  'member.added': {
    icon: '👥',
    bg: 'var(--accent-bg)',
    color: 'var(--accent2)',
  },

  'member.removed': {
    icon: '🚫',
    bg: 'var(--red-bg)',
    color: 'var(--red)',
  },

  'member.role_updated': {
    icon: '🔑',
    bg: 'var(--blue-bg)',
    color: 'var(--blue)',
  },

  'project.created': {
    icon: '📁',
    bg: 'var(--green-bg)',
    color: 'var(--green)',
  },

  'project.updated': {
    icon: '⚙️',
    bg: 'var(--amber-bg)',
    color: 'var(--amber)',
  },
}

const DEFAULT = {
  icon: '📋',
  bg: 'rgba(120,120,140,0.1)',
  color: 'var(--text2)',
}

const ACTION_OPTIONS = [
  { value: '', label: 'All actions' },

  { value: 'secret.created', label: 'Secret created' },

  { value: 'secret.revealed', label: 'Secret revealed' },

  { value: 'secret.rotated', label: 'Secret rotated' },

  { value: 'secret.deleted', label: 'Secret deleted' },

  { value: 'secret.updated', label: 'Secret updated' },

  { value: 'project.created', label: 'Project created' },

  { value: 'project.updated', label: 'Project updated' },

  { value: 'member.added', label: 'Member added' },

  { value: 'member.removed', label: 'Member removed' },
]

export default function AuditLogList({ projectId }) {
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const params = {
    action: action || undefined,
    from: from || undefined,
    to: to || undefined,
  }

  const {
    data: list = [],
    isLoading,
    load,
  } = useAuditLogs(projectId, params)

  useEffect(() => {
    load()
  }, [load])

  const formatAction = (log) => {
    const actor = `<strong>${log.performed_by || 'Someone'}</strong>`

    const resourceName =
      log.secret_key ||
      log.resourceKey ||
      log.resourceName ||
      ''

    const resource = resourceName
      ? `<strong>${resourceName}</strong>`
      : ''

    const map = {
      'secret.created':
        `${actor} created secret ${resource}`,

      'secret.revealed':
        `${actor} revealed secret ${resource}`,

      'secret.rotated':
        `${actor} rotated secret ${resource}`,

      'secret.deleted':
        `${actor} deleted secret ${resource}`,

      'secret.updated':
        `${actor} updated secret ${resource}`,

      'member.added':
        `${actor} added member ${resource}`,

      'member.removed':
        `${actor} removed member ${resource}`,

      'member.role_updated':
        `${actor} updated role for ${resource}`,

      'project.created':
        `${actor} created project`,

      'project.updated':
        `${actor} updated project settings`,
    }

    return map[log.action] || `${actor} performed ${log.action}`
  }

  return (
    <>
      <div className="filter-bar">
        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          {ACTION_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="form-input"
          style={{ width: 'auto' }}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <span
          style={{
            color: 'var(--text3)',
            fontSize: 12,
          }}
        >
          to
        </span>

        <input
          type="date"
          className="form-input"
          style={{ width: 'auto' }}
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        {(action || from || to) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setAction('')
              setFrom('')
              setTo('')
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="card">
        <div style={{ padding: '0 20px' }}>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '14px 0',
                  borderBottom:
                    '1px solid rgba(120,120,180,0.05)',
                }}
              >
                <Skeleton
                  width={32}
                  height={32}
                  style={{
                    borderRadius: 8,
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <Skeleton
                    width="80%"
                    height={13}
                    style={{ marginBottom: 6 }}
                  />

                  <Skeleton
                    width={80}
                    height={11}
                  />
                </div>
              </div>
            ))
          ) : list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>

              <div className="empty-title">
                No audit logs
              </div>

              <div className="empty-desc">
                Activity will appear here as your
                team uses the vault
              </div>
            </div>
          ) : (
            list.map((log, i) => {
              const {
                icon,
                bg,
                color,
              } = ACTION_ICONS[log.action] || DEFAULT

              return (
                <div
                  key={log.id || i}
                  className="audit-item"
                >
                  <div
                    className="audit-icon"
                    style={{
                      background: bg,
                      color,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>
                      {icon}
                    </span>
                  </div>

                  <div className="audit-content">
                    <div
                      className="audit-action"
                      dangerouslySetInnerHTML={{
                        __html: formatAction(log),
                      }}
                    />

                    <div className="audit-time">
                      {formatRelative(
                        log.created_at ||
                        log.createdAt ||
                        log.timestamp
                      )}
                    </div>
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