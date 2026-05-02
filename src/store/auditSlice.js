import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/axios'

export const fetchAuditLogs = createAsyncThunk('audit/fetchLogs', async ({ projectId, params }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/projects/${projectId}/audit`, { params })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to load audit logs')
  }
})

const auditSlice = createSlice({
  name: 'audit',
  initialState: {
    list:    [],
    loading: false,
    error:   null,
  },
  reducers: {
    clearAudit(state) { state.list = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => { state.list = action.payload?.items || action.payload || []; state.loading = false })
      .addCase(fetchAuditLogs.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { clearAudit } = auditSlice.actions
export default auditSlice.reducer