import { createContext, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, logout, logoutAll } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { user, loading, initialized } = useSelector(s => s.auth)

  // On app load, check if user is logged in
  useEffect(() => {
    if (!user && !initialized) {
      dispatch(fetchMe())
    }
  }, [dispatch, user, initialized])

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  const handleLogoutAll = async () => {
    await dispatch(logoutAll())
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading: !initialized || loading,
      loggingOut: false,
      logout: handleLogout,
      logoutAll: handleLogoutAll,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
