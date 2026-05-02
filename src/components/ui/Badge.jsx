import { cn } from '../../lib/utils'

const variants = {
  green: 'badge-green',
  red: 'badge-red',
  amber: 'badge-amber',
  blue: 'badge-blue',
  purple: 'badge-purple',
  gray: 'badge-gray',
}

export default function Badge({ children, variant = 'gray', dot = false, className }) {
  return (
    <span className={cn('badge', variants[variant], dot && 'badge-dot', className)}>
      {children}
    </span>
  )
}

export function EnvBadge({ env }) {
  const map = {
    production: { variant: 'green', label: 'prod' },
    staging: { variant: 'blue', label: 'staging' },
    development: { variant: 'amber', label: 'dev' },
  }
  const { variant, label } = map[env] || { variant: 'gray', label: env }
  return <Badge variant={variant} dot>{label}</Badge>
}

export function RoleBadge({ role }) {
  const map = {
    admin: 'purple',
    developer: 'blue',
    viewer: 'gray',
  }
  return <Badge variant={map[role] || 'gray'}>{role}</Badge>
}
