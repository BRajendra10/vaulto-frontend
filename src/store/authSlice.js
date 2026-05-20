import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/axios'

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/users/me')
    return res.data.data
  } catch (err) {
    if (err?.response?.status === 401) return null
    return rejectWithValue(err?.response?.data?.message || 'Failed to fetch user')
  }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    await api.post('/auth/login', data)
    const res = await api.get('/users/me')
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Invalid credentials')
  }
})

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Registration failed')
  }
})

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (data, { rejectWithValue }) => {
  try {
    await api.post('/auth/verify-email', data)
    const res = await api.get('/users/me')
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Invalid OTP')
  }
})

export const resendOtp = createAsyncThunk('auth/resendOtp', async (email, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/resend-otp', { email })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Failed to resend OTP')
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  try { await api.post('/auth/logout') } catch (_) {}
})

export const logoutAll = createAsyncThunk('auth/logoutAll', async () => {
  try { await api.post('/auth/logout-all') } catch (_) {}
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.patch('/users/me', data)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Update failed')
  }
})

export const changePassword = createAsyncThunk('auth/changePassword', async (data, { rejectWithValue }) => {
  try {
    await api.patch('/users/me/password', data)
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Password change failed')
  }
})

export const updateAvatar = createAsyncThunk('auth/updateAvatar', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': undefined },
    })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || 'Avatar upload failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:          null,
    loading:       false,
    actionLoading: false,
    error:         null,
    initialized:   false,
  },
  reducers: {
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending,   (state) => { state.loading = true })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; state.initialized = true })
      .addCase(fetchMe.rejected,  (state) => { state.user = null; state.loading = false; state.initialized = true })

    builder
      .addCase(login.pending,   (state) => { state.actionLoading = true;  state.error = null })
      .addCase(login.fulfilled, (state, action) => { state.user = action.payload; state.actionLoading = false })
      .addCase(login.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(register.pending,   (state) => { state.actionLoading = true;  state.error = null })
      .addCase(register.fulfilled, (state) => { state.actionLoading = false })
      .addCase(register.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(verifyOtp.pending,   (state) => { state.actionLoading = true;  state.error = null })
      .addCase(verifyOtp.fulfilled, (state, action) => { state.user = action.payload; state.actionLoading = false })
      .addCase(verifyOtp.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(logout.fulfilled,    (state) => { state.user = null })
      .addCase(logoutAll.fulfilled, (state) => { state.user = null })

    builder
      .addCase(updateProfile.pending,   (state) => { state.actionLoading = true;  state.error = null })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload; state.actionLoading = false })
      .addCase(updateProfile.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(changePassword.pending,   (state) => { state.actionLoading = true;  state.error = null })
      .addCase(changePassword.fulfilled, (state) => { state.actionLoading = false })
      .addCase(changePassword.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload })

    builder
      .addCase(updateAvatar.pending, (state) => { state.actionLoading = true; state.error = null })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        if (state.user) state.user = { ...state.user, avatar: action.payload.avatar }
        state.actionLoading = false
      })
      .addCase(updateAvatar.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer