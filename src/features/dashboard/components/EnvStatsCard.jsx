export function EnvStatsCard({ environmentStats }) {
  const env = environmentStats || {}

  const items = [
    {
      label: 'Development',
      value: env.development ?? 0,
      badge: 'badge-green',
    },
    {
      label: 'Staging',
      value: env.staging ?? 0,
      badge: 'badge-amber',
    },
    {
      label: 'Production',
      value: env.production ?? 0,
      badge: 'badge-red',
    },
  ]

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          Environment Statistics
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {items.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 12,
                borderBottom: '1px solid rgba(120,120,180,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span className={`badge badge-dot ${item.badge}`}>
                  {item.label}
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}