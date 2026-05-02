import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(function Input(
  { label, error, suffix, mono, className, style, ...props },
  ref
) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          ref={ref}
          className={cn('form-input', mono && 'mono', error && 'input-error', className)}
          style={style}
          {...props}
        />
        {suffix && (
          <div style={{
            position: 'absolute', right: 10, top: '50%',
            transform: 'translateY(-50%)', display: 'flex', alignItems: 'center',
          }}>
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
})

export default Input
