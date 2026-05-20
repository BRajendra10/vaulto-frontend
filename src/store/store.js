import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import projectsReducer from './projectsSlice'
import secretsReducer from './secretsSlice'
import maintainersReducer from './maintainersSlice'
import auditReducer from './auditSlice'
import dashboardReducer from './dashboardSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    secrets: secretsReducer,
    maintainers: maintainersReducer,
    audit: auditReducer,
    dashboard: dashboardReducer,
  },
})

export default store
