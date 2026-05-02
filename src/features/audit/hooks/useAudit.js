import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { fetchAuditLogs } from '../../../store/auditSlice'

export function useAuditLogs(projectId, params) {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector(s => s.audit)

  const load = useCallback(() => {
    if (projectId) dispatch(fetchAuditLogs({ projectId, params }))
  }, [dispatch, projectId, JSON.stringify(params)])

  return { data: list, isLoading: loading, error, load }
}
