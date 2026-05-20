import { Loader2 } from 'lucide-react'

export function StatCard({
  title,
  value,
  loading,
  delta,
  deltaType = 'up',
  icon: Icon,
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">{title}</div>

      <div className="stat-value">
        {loading ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          value
        )}
      </div>

      {delta && (
        <div className={`stat-delta ${deltaType}`}>
          {delta}
        </div>
      )}

      {Icon && (
        <div className="stat-icon">
          <Icon size={32} />
        </div>
      )}
    </div>
  )
}