export function Skeleton({ width, height = 16, style }) {
  return (
    <div
      className="skeleton"
      style={{ width: width || '100%', height, borderRadius: 6, ...style }}
    />
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} style={{ padding: '12px 16px' }}>
              <Skeleton width={j === 0 ? 140 : 80} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <Skeleton width={160} height={18} style={{ marginBottom: 10 }} />
      <Skeleton height={13} style={{ marginBottom: 6 }} />
      <Skeleton height={13} width="70%" />
    </div>
  )
}
