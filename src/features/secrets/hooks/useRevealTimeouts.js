import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { hideSecret } from '../../../store/secretsSlice'

// Manages per-secret reveal auto-hide timers with cancellation.
// Keeps behavior deterministic across rapid reveals and component unmount.
export function useRevealTimeouts() {
  const dispatch = useDispatch()
  const timersRef = useRef(new Map())

  useEffect(() => {
    return () => {
      for (const t of timersRef.current.values()) clearTimeout(t)
      timersRef.current.clear()
    }
  }, [])

  const scheduleHide = (secretId, ms) => {
    const existing = timersRef.current.get(secretId)
    if (existing) clearTimeout(existing)

    const t = setTimeout(() => {
      // Timer callback may fire after a subsequent reveal; cancel in scheduleHide.
      dispatch(hideSecret(secretId))
      timersRef.current.delete(secretId)
    }, ms)

    timersRef.current.set(secretId, t)
  }

  return { scheduleHide }
}

