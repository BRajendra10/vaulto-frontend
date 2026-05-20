import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/axios'

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/projects', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to load projects')
  }
})

export const fetchProject = createAsyncThunk('projects/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/projects/${id}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to load project')
  }
})

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/projects', {
      project_name: data.name,
      description: data.description?.trim() || undefined,
    })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to create project')
  }
})

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/projects/${id}`, {
      project_name: data.name,
      description: data.description?.trim() || undefined,
    })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to update project')
  }
})

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to delete project')
  }
})

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
    current: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) { state.current = null },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.list = action.payload.data; state.meta = action.payload.meta; state.loading = false })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload })

    builder
      .addCase(fetchProject.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProject.fulfilled, (state, action) => { state.current = action.payload; state.loading = false })
      .addCase(fetchProject.rejected, (state, action) => { state.loading = false; state.error = action.payload })

    builder
      .addCase(createProject.pending, (state) => { state.actionLoading = true; state.error = null })
      .addCase(createProject.fulfilled, (state, action) => {
        if (state.meta.page === 1) {
          state.list.unshift(action.payload)
        }
        state.actionLoading = false
      })
      .addCase(createProject.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(updateProject.pending, (state) => { state.actionLoading = true })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.current = action.payload
        const idx = state.list.findIndex(p => (p.id) === (action.payload?.id))
        if (idx !== -1) state.list[idx] = action.payload
        state.actionLoading = false
      })
      .addCase(updateProject.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter(p => (p.id) !== action.payload)
        state.current = null
      })
  },
})

export const { clearCurrent, clearError } = projectsSlice.actions
export default projectsSlice.reducer