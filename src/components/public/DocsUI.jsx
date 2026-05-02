// ── Typography ───────────────────────────────────────────
export function H1({ children }) {
  return (
    <h1 style={{
      fontFamily: 'Syne, sans-serif', fontSize: 34, fontWeight: 700,
      letterSpacing: '-0.5px', color: '#e8e8f0', marginBottom: 12, lineHeight: 1.2,
    }}>
      {children}
    </h1>
  )
}

export function H2({ children, id }) {
  return (
    <h2 id={id} style={{
      fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 600,
      letterSpacing: '-0.3px', color: '#e8e8f0',
      marginTop: 48, marginBottom: 14, lineHeight: 1.3,
      paddingTop: 48, borderTop: '1px solid rgba(120,120,180,0.1)',
    }}>
      {children}
    </h2>
  )
}

export function H3({ children }) {
  return (
    <h3 style={{
      fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 600,
      color: '#e8e8f0', marginTop: 28, marginBottom: 10,
    }}>
      {children}
    </h3>
  )
}

export function P({ children, style }) {
  return (
    <p style={{ fontSize: 14.5, color: '#8888a0', lineHeight: 1.8, marginBottom: 16, ...style }}>
      {children}
    </p>
  )
}

export function Lead({ children }) {
  return (
    <p style={{ fontSize: 17, color: '#aaaabc', lineHeight: 1.7, marginBottom: 28 }}>
      {children}
    </p>
  )
}

// ── Code ─────────────────────────────────────────────────
export function Code({ children }) {
  return (
    <code style={{
      fontFamily: 'DM Mono, monospace', fontSize: 12.5,
      background: 'rgba(124,106,247,0.12)', color: '#a394f9',
      padding: '2px 6px', borderRadius: 4,
      border: '1px solid rgba(124,106,247,0.2)',
    }}>
      {children}
    </code>
  )
}

export function CodeBlock({ children, lang = '' }) {
  return (
    <div style={{
      background: '#0f0f16', border: '1px solid rgba(120,120,180,0.15)',
      borderRadius: 10, overflow: 'hidden', marginBottom: 20,
    }}>
      {lang && (
        <div style={{
          padding: '7px 16px', borderBottom: '1px solid rgba(120,120,180,0.1)',
          fontSize: 11, color: '#555568', fontFamily: 'DM Mono, monospace',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{lang}</span>
        </div>
      )}
      <pre style={{
        padding: '18px 20px', margin: 0, overflowX: 'auto',
        fontFamily: 'DM Mono, monospace', fontSize: 13, lineHeight: 1.7,
        color: '#c8c8e0',
      }}>
        <code>{children}</code>
      </pre>
    </div>
  )
}

// ── Callouts ─────────────────────────────────────────────
const CALLOUT_STYLES = {
  info:    { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)',  color: '#60a5fa',  icon: 'ℹ' },
  warning: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', color: '#fbbf24', icon: '⚠' },
  danger:  { bg: 'rgba(248,113,113,0.08)',border: 'rgba(248,113,113,0.25)',color: '#f87171', icon: '🚫' },
  success: { bg: 'rgba(45,212,160,0.08)', border: 'rgba(45,212,160,0.25)', color: '#2dd4a0', icon: '✓' },
}

export function Callout({ type = 'info', title, children }) {
  const s = CALLOUT_STYLES[type]
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 10, padding: '14px 18px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ color: s.color, fontSize: 15, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
        <div>
          {title && <div style={{ fontWeight: 600, fontSize: 13.5, color: s.color, marginBottom: 4 }}>{title}</div>}
          <div style={{ fontSize: 13.5, color: '#aaaabc', lineHeight: 1.7 }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

// ── Steps ─────────────────────────────────────────────────
export function Steps({ children }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 40, marginBottom: 24 }}>
      {children}
    </div>
  )
}

export function Step({ n, title, children }) {
  return (
    <div style={{ position: 'relative', marginBottom: 28 }}>
      <div style={{
        position: 'absolute', left: -40, top: 0,
        width: 26, height: 26, borderRadius: '50%',
        background: 'rgba(124,106,247,0.15)',
        border: '1px solid rgba(124,106,247,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600, color: '#a394f9',
        fontFamily: 'DM Mono, monospace',
      }}>
        {n}
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, color: '#e8e8f0', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: '#8888a0', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────
export function DocTable({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '10px 14px',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.5px',
                textTransform: 'uppercase', color: '#555568',
                borderBottom: '1px solid rgba(120,120,180,0.15)',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(120,120,180,0.07)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '11px 14px', fontSize: 13.5, color: '#aaaabc', verticalAlign: 'top', lineHeight: 1.6 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────
export function DocBadge({ children, color = 'purple' }) {
  const colors = {
    purple: { bg: 'rgba(124,106,247,0.15)', text: '#a394f9', border: 'rgba(124,106,247,0.3)' },
    green:  { bg: 'rgba(45,212,160,0.1)',   text: '#2dd4a0', border: 'rgba(45,212,160,0.3)' },
    amber:  { bg: 'rgba(251,191,36,0.1)',   text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
    red:    { bg: 'rgba(248,113,113,0.1)',  text: '#f87171', border: 'rgba(248,113,113,0.3)' },
    blue:   { bg: 'rgba(96,165,250,0.1)',   text: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  }
  const c = colors[color]
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 20,
      fontSize: 11.5, fontWeight: 500,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  )
}

// ── Divider ───────────────────────────────────────────────
export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid rgba(120,120,180,0.1)', margin: '40px 0' }} />
}
