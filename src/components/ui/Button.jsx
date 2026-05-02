import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  outline: 'btn-outline',
}

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'btn',
        variants[variant],
        sizes[size],
        fullWidth && 'btn-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
