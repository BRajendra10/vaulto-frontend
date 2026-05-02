import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
  fetchSecrets, createSecret, revealSecret,
  rotateSecret, fetchSecretVersions, deleteSecret, hideSecret
} from '../../../store/secretsSlice'
import toast from 'react-hot-toast'

export function useSecrets(projectId, env) {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector(s => s.secrets)

  const load = useCallback(() => {
    if (projectId) dispatch(fetchSecrets({ projectId, env }))
  }, [dispatch, projectId, env])

  return { data: list, isLoading: loading, error, load }
}

export function useRevealedValues() {
  return useSelector(s => s.secrets.revealedValues)
}

export function useCreateSecret(projectId) {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.secrets)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(createSecret({ projectId, data }))
    if (createSecret.rejected.match(result)) {
      toast.error(result.payload || 'Failed to create secret')
      throw new Error(result.payload)
    }
    toast.success('Secret created')
    return result.payload
  }, [dispatch, projectId])

  return { mutate, isPending: actionLoading }
}

export function useRevealSecret(projectId) {
  const dispatch = useDispatch()

  const mutate = useCallback(async (secretId) => {
    const result = await dispatch(revealSecret({ projectId, secretId }))
    if (revealSecret.rejected.match(result)) {
      toast.error(result.payload || 'Failed to reveal secret')
      throw new Error(result.payload)
    }
    // Auto-hide after 8 seconds
    setTimeout(() => dispatch(hideSecret(secretId)), 8000)
    return result.payload
  }, [dispatch, projectId])

  return { mutate }
}

export function useHideSecret() {
  const dispatch = useDispatch()
  return useCallback((secretId) => dispatch(hideSecret(secretId)), [dispatch])
}

export function useRotateSecret(projectId) {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.secrets)

  const mutate = useCallback(async ({ secretId, value, environment }) => {
    const result = await dispatch(rotateSecret({ projectId, secretId, value, environment }))
    if (rotateSecret.rejected.match(result)) {
      toast.error(result.payload || 'Failed to rotate secret')
      throw new Error(result.payload)
    }
    toast.success('Secret rotated — new version created')
    return result.payload
  }, [dispatch, projectId])

  return { mutate, isPending: actionLoading }
}

export function useSecretVersions(projectId, secretId) {
  const dispatch = useDispatch()
  const versions = useSelector(s => s.secrets.versions[secretId] || [])

  const load = useCallback(() => {
    if (projectId && secretId) dispatch(fetchSecretVersions({ projectId, secretId }))
  }, [dispatch, projectId, secretId])

  return { data: versions, load }
}

export function useDeleteSecret(projectId) {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.secrets)

  const mutate = useCallback(async (secretId) => {
    const result = await dispatch(deleteSecret({ projectId, secretId }))
    if (deleteSecret.rejected.match(result)) {
      toast.error(result.payload || 'Failed to delete secret')
      throw new Error(result.payload)
    }
    toast.success('Secret deleted')
  }, [dispatch, projectId])

  return { mutate, isPending: actionLoading }
}
