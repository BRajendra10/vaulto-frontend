import { forwardRef } from 'react'

const Select = forwardRef(function Select({ label, error, options = [], ...props }, ref) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select ref={ref} className="form-select" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
})

export default Select
