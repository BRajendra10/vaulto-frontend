import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve())
  failedQueue = []
}

// Routes that should NEVER trigger a refresh attempt
const SKIP_REFRESH = ['/auth/refresh', '/auth/login', '/auth/register']

const shouldSkipRefresh = (url = '') => {
  return SKIP_REFRESH.some(path => url.includes(path))
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // Don't retry auth routes, session-check route, or already-retried requests
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !shouldSkipRefresh(original.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(original))
          .catch(err => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      try {
        await api.post('/auth/refresh')
        processQueue(null)
        return api(original)
      } catch (err) {
        processQueue(err)
        // Only redirect if we're not already on an auth page
        if (!window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/register')) {
          window.location.href = '/login'
        }
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
