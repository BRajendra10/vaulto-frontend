import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/axios'

export const fetchSecrets = createAsyncThunk('secrets/fetchAll', async ({ projectId, env }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/projects/${projectId}/secrets`, {
      params: env ? { environment: env } : {},
    })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to load secrets')
  }
})

export const createSecret = createAsyncThunk('secrets/create', async ({ projectId, data }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/projects/${projectId}/secrets`, {
      key:         data.key,
      value:       data.value,
      environment: data.environment,
      expires_at:  data.expiresAt || undefined,
    })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to create secret')
  }
})

export const revealSecret = createAsyncThunk('secrets/reveal', async ({ projectId, secretId }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/projects/${projectId}/secrets/${secretId}`)
    const secret = res.data.data
    const value  = secret?.value ?? secret?.data?.value ?? secret
    return { secretId, value }
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to reveal secret')
  }
})

export const rotateSecret = createAsyncThunk('secrets/rotate', async ({ projectId, secretId, value, environment }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/projects/${projectId}/secrets/${secretId}/rotate`, {
      value,
      environment,
    })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to rotate secret')
  }
})

export const fetchSecretVersions = createAsyncThunk('secrets/fetchVersions', async ({ projectId, secretId }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/projects/${projectId}/secrets/${secretId}/versions`)
    return { secretId, versions: res.data.data?.items || res.data.data || [] }
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to load versions')
  }
})

export const deleteSecret = createAsyncThunk('secrets/delete', async ({ projectId, secretId }, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${projectId}/secrets/${secretId}`)
    return secretId
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to delete secret')
  }
})

const secretsSlice = createSlice({
  name: 'secrets',
  initialState: {
    list:           [],
    revealedValues: {},
    versions:       {},
    loading:        false,
    actionLoading:  false,
    error:          null,
  },
  reducers: {
    hideSecret(state, action)  { delete state.revealedValues[action.payload] },
    clearSecrets(state)        { state.list = []; state.revealedValues = {}; state.versions = {} },
    clearError(state)          { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecrets.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(fetchSecrets.fulfilled, (state, action) => { state.list = action.payload?.items || action.payload || []; state.loading = false; state.revealedValues = {} })
      .addCase(fetchSecrets.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

    builder
      .addCase(createSecret.pending,   (state) => { state.actionLoading = true; state.error = null })
      .addCase(createSecret.fulfilled, (state, action) => { state.list.unshift(action.payload); state.actionLoading = false })
      .addCase(createSecret.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(revealSecret.fulfilled, (state, action) => { state.revealedValues[action.payload.secretId] = action.payload.value })
      .addCase(revealSecret.rejected,  (state, action) => { state.error = action.payload })

    builder
      .addCase(rotateSecret.pending,   (state) => { state.actionLoading = true })
      .addCase(rotateSecret.fulfilled, (state, action) => {
        const id  = action.payload?.id || action.payload?._id
        const idx = state.list.findIndex(s => (s.id || s._id) === id)
        if (idx !== -1) state.list[idx] = action.payload
        state.actionLoading = false
      })
      .addCase(rotateSecret.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(fetchSecretVersions.fulfilled, (state, action) => {
        state.versions[action.payload.secretId] = action.payload.versions
      })

    builder
      .addCase(deleteSecret.fulfilled, (state, action) => {
        state.list = state.list.filter(s => (s.id || s._id) !== action.payload)
        delete state.revealedValues[action.payload]
      })
      .addCase(deleteSecret.rejected,  (state, action) => { state.error = action.payload })
  },
})

export const { hideSecret, clearSecrets, clearError } = secretsSlice.actions
export default secretsSlice.reducer