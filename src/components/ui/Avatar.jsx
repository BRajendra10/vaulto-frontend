import { getInitials } from '../../lib/utils'

const COLORS = [
  '#7c6af7', '#60a5fa', '#2dd4a0', '#f472b6',
  '#fb923c', '#a78bfa', '#34d399', '#f87171',
]

const colorFor = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}


export default function Avatar({ name = '', size = 34 }) {
  const color = colorFor(name)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color + '22',
      color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35,
      fontWeight: 600,
      flexShrink: 0,
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {getInitials(name)}
    </div>
  )
}
