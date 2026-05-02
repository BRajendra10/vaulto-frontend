import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/axios'

export const fetchMaintainers = createAsyncThunk('maintainers/fetchAll', async (projectId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/projects/${projectId}/maintainers`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to load maintainers')
  }
})

export const addMaintainer = createAsyncThunk('maintainers/add', async ({ projectId, data }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/projects/${projectId}/maintainers`, data)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to add maintainer')
  }
})

export const updateMaintainerRole = createAsyncThunk('maintainers/updateRole', async ({ projectId, userId, role }, { rejectWithValue }) => {
  try {
    await api.patch(`/projects/${projectId}/maintainers/${userId}`, { role })
    return { userId, role }
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to update role')
  }
})

export const removeMaintainer = createAsyncThunk('maintainers/remove', async ({ projectId, userId }, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${projectId}/maintainers/${userId}`)
    return userId
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to remove maintainer')
  }
})

const maintainersSlice = createSlice({
  name: 'maintainers',
  initialState: {
    list:          [],
    loading:       false,
    actionLoading: false,
    error:         null,
  },
  reducers: {
    clearMaintainers(state) { state.list = [] },
    clearError(state)   { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintainers.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchMaintainers.fulfilled, (state, action) => { state.list = action.payload || []; state.loading = false })
      .addCase(fetchMaintainers.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

    builder
      .addCase(addMaintainer.pending,   (state) => { state.actionLoading = true; state.error = null })
      .addCase(addMaintainer.fulfilled, (state, action) => { state.list.push(action.payload); state.actionLoading = false })
      .addCase(addMaintainer.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(updateMaintainerRole.pending,   (state) => { state.actionLoading = true })
      .addCase(updateMaintainerRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload
        const idx = state.list.findIndex(m => (m.user_id || m.id) === userId)
        if (idx !== -1) state.list[idx].role = role
        state.actionLoading = false
      })
      .addCase(updateMaintainerRole.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(removeMaintainer.fulfilled, (state, action) => { state.list = state.list.filter(m => (m.user_id || m.id) !== action.payload) })
      .addCase(removeMaintainer.rejected,  (state, action) => { state.error = action.payload })
  },
})

export const { clearMaintainers, clearError } = maintainersSlice.actions
export default maintainersSlice.reducer