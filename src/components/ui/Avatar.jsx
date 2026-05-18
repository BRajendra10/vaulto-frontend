export default function Avatar({
  src,
  name = 'User',
  size = 40,
  className = '',
}) {
  return (
    <img
      src={src}
      alt={name}
      draggable={false}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
        userSelect: 'none',
        display: 'block',
      }}
    />
  )
}