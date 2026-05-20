import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../../../store/dashboardSlice'

export function useDashboard() {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((s) => s.dashboard)

  const load = useCallback(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  useEffect(() => {
    // Fetch on mount
    load()
  }, [load])

  return {
    data,
    loading,
    error,
    refetch: load,
  }
}

