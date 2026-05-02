import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Auth pages
import LoginPage      from './features/auth/components/LoginPage'
import RegisterPage   from './features/auth/components/RegisterPage'
import VerifyOtpPage  from './features/auth/components/VerifyOtpPage'

// App pages
import DashboardPage     from './pages/DashboardPage'
import ProjectsPage      from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProfilePage       from './pages/ProfilePage'

// Docs pages (public, no auth required)
import DocsIntroPage    from './pages/docs/DocsIntroPage'
import DocsSecretsPage  from './pages/docs/DocsSecretsPage'
import DocsRbacPage     from './pages/docs/DocsRbacPage'
import DocsSecurityPage from './pages/docs/DocsSecurityPage'
import DocsApiPage      from './pages/docs/DocsApiPage'

export default function App() {
  return (
    <Routes>
      {/* ── Public auth ── */}
      <Route path="/login"       element={<LoginPage />}     />
      <Route path="/register"    element={<RegisterPage />}  />
      <Route path="/verify-otp"  element={<VerifyOtpPage />} />

      {/* ── Public docs (no login required) ── */}
      <Route path="/docs"              element={<DocsIntroPage />}    />
      <Route path="/docs/secrets"      element={<DocsSecretsPage />}  />
      <Route path="/docs/environments" element={<DocsSecretsPage />}  />
      <Route path="/docs/rbac"         element={<DocsRbacPage />}     />
      <Route path="/docs/security"     element={<DocsSecurityPage />} />
      <Route path="/docs/api"          element={<DocsApiPage />}      />

      {/* ── Protected app routes ── */}
      <Route path="/dashboard"           element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}     />
      <Route path="/projects"            element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>}      />
      <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
      <Route path="/profile"             element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}       />

      {/* ── Default ── */}
      <Route path="/" element={<Navigate to="/docs" replace />} />
      <Route path="*" element={<Navigate to="/docs" replace />} />
    </Routes>
  )
}
