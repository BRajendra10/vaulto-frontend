export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export const formatRelative = (dateStr) => {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(dateStr)
}

export const extractApiError = (err) => {
  const data = err?.response?.data
  if (data?.errors?.length) return data.errors[0].message || data.message
  return data?.message || err?.message || 'Something went wrong'
}

export const ROLES = { ADMIN: 'admin', DEVELOPER: 'developer', VIEWER: 'viewer' }
export const ROLE_ORDER = { admin: 3, developer: 2, viewer: 1 }
export const canManage = (actorRole, targetRole) =>
  (ROLE_ORDER[actorRole] || 0) > (ROLE_ORDER[targetRole] || 0)

export const ENVS = ['development', 'staging', 'production']
