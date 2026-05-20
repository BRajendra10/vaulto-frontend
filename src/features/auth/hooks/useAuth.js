import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { login, register, verifyOtp, logout, logoutAll, updateProfile, changePassword, updateAvatar } from '../../../store/authSlice'
import toast from 'react-hot-toast'

export function useLogin() {
  const dispatch = useDispatch()
  const { actionLoading, error } = useSelector(s => s.auth)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(login(data))
    if (login.rejected.match(result)) {
      toast.error(result.payload || 'Login failed')
      throw new Error(result.payload)
    }
    return result.payload
  }, [dispatch])

  return { mutate, isPending: actionLoading, error }
}

export function useRegister() {
  const dispatch = useDispatch()
  const { actionLoading, error } = useSelector(s => s.auth)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(register(data))
    if (register.rejected.match(result)) {
      toast.error(result.payload || 'Registration failed')
      throw new Error(result.payload)
    }
    return result.payload
  }, [dispatch])

  return { mutate, isPending: actionLoading, error }
}

export function useVerifyOtp() {
  const dispatch = useDispatch()
  const { actionLoading, error } = useSelector(s => s.auth)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(verifyOtp(data))
    if (verifyOtp.rejected.match(result)) {
      toast.error(result.payload || 'Invalid OTP')
      throw new Error(result.payload)
    }
    return result.payload
  }, [dispatch])

  return { mutate, isPending: actionLoading, error }
}

export function useUpdateProfile() {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.auth)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(updateProfile(data))
    if (updateProfile.rejected.match(result)) {
      toast.error(result.payload || 'Update failed')
      throw new Error(result.payload)
    }
    toast.success('Profile updated')
    return result.payload
  }, [dispatch])

  return { mutate, isPending: actionLoading }
}

export function useChangePassword() {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.auth)

  const mutate = useCallback(async (data) => {
    const result = await dispatch(changePassword(data))
    if (changePassword.rejected.match(result)) {
      toast.error(result.payload || 'Password change failed')
      throw new Error(result.payload)
    }
    toast.success('Password changed successfully')
  }, [dispatch])

  return { mutate, isPending: actionLoading }
}

export function useUpdateAvatar() {
  const dispatch = useDispatch()
  const { actionLoading } = useSelector(s => s.auth)

  const mutate = useCallback(async (file) => {
    const result = await dispatch(updateAvatar(file))
    if (updateAvatar.rejected.match(result)) {
      toast.error(result.payload || 'Avatar upload failed')
      throw new Error(result.payload)
    }
    toast.success('Avatar updated')
    return result.payload
  }, [dispatch])

  return { mutate, isPending: actionLoading }
}
