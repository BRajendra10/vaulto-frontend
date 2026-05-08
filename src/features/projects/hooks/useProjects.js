import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { fetchProjects, fetchProject, createProject, updateProject, deleteProject } from '../../../store/projectsSlice'
import toast from 'react-hot-toast'

export function useProjects(params) {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector(s => s.projects)
  
  const load = useCallback(() => dispatch(fetchProjects(params)), [dispatch])

  return { data: list, isLoading: loading, error, load }
}

export function useProject(id) {
  const dispatch = useDispatch()
  const { current, loading } = useSelector(s => s.projects)

  const load = useCallback(() => { if (id) dispatch(fetchProject(id)) }, [dispatch, id])

  return { data: current, isLoading: loading, load }
}

export function useCreateProject() {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.projects)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(createProject(data))
    if (createProject.rejected.match(result)) {
      toast.error(result.payload || 'Failed to create project')
      throw new Error(result.payload)
    }
    toast.success('Project created!')
    return result.payload
  }, [dispatch])

  return { mutate, isPending: actionLoading }
}

export function useUpdateProject(id) {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.projects)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(updateProject({ id, data }))
    if (updateProject.rejected.match(result)) {
      toast.error(result.payload || 'Failed to update project')
      throw new Error(result.payload)
    }
    toast.success('Project updated')
    return result.payload
  }, [dispatch, id])

  return { mutate, isPending: actionLoading }
}

export function useDeleteProject(id) {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.projects)

  const mutate = useCallback(async () => {
    const result = await dispatch(deleteProject(id))
    if (deleteProject.rejected.match(result)) {
      toast.error(result.payload || 'Failed to delete project')
      throw new Error(result.payload)
    }
    toast.success('Project deleted')
  }, [dispatch, id])

  return { mutate, isPending: actionLoading }
}
