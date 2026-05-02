import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { fetchMaintainers, addMaintainer, updateMaintainerRole, removeMaintainer } from '../../../store/maintainersSlice'
import toast from 'react-hot-toast'

export function useMaintainers(projectId) {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector(s => s.maintainers)

  const load = useCallback(() => {
    if (projectId) dispatch(fetchMaintainers(projectId))
  }, [dispatch, projectId])

  return { data: list, isLoading: loading, error, load }
}

export function useAddMaintainer(projectId) {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.maintainers)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(addMaintainer({ projectId, data }))
    if (addMaintainer.rejected.match(result)) {
      toast.error(result.payload || 'Failed to invite maintainer')
      throw new Error(result.payload)
    }
    toast.success('Maintainer invited')
    return result.payload
  }, [dispatch, projectId])

  return { mutate, isPending: actionLoading }
}

export function useUpdateMaintainerRole(projectId) {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.maintainers)

  const mutate = useCallback(async ({ userId, role }) => {
    const result = await dispatch(updateMaintainerRole({ projectId, userId, role }))
    if (updateMaintainerRole.rejected.match(result)) {
      toast.error(result.payload || 'Failed to update role')
      throw new Error(result.payload)
    }
    toast.success('Role updated')
  }, [dispatch, projectId])

  return { mutate, isPending: actionLoading }
}

export function useRemoveMaintainer(projectId) {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.maintainers)

  const mutate = useCallback(async (userId) => {
    const result = await dispatch(removeMaintainer({ projectId, userId }))
    if (removeMaintainer.rejected.match(result)) {
      toast.error(result.payload || 'Failed to remove maintainer')
      throw new Error(result.payload)
    }
    toast.success('Maintainer removed')
  }, [dispatch, projectId])

  return { mutate, isPending: actionLoading }
}
