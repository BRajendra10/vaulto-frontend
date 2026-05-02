import { useRef, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, Plus } from 'lucide-react'
import Button from '../ui/Button'
import CreateSecretModal from '../../features/secrets/components/CreateSecretModal'

const ROUTE_LABELS = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/secrets': 'Secrets',
  '/members': 'Members',
  '/audit': 'Audit Logs',
  '/settings': 'Settings',
  '/profile': 'Profile',
}

function useDebouncedCallback(fn, delay) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

export default function Topbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [showCreateSecret, setShowCreateSecret] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const label = ROUTE_LABELS[pathname] ||
    (pathname.startsWith('/projects/') ? 'Project Detail' : 'Vaulto')

  const handleSearch = useDebouncedCallback((val) => {
    // global search handler - can be wired to context if needed
    console.log('search:', val)
  }, 300)

  // Extract projectId from URL for CreateSecretModal
  const projectIdMatch = pathname.match(/\/projects\/([^/]+)/)
  const projectId = projectIdMatch ? projectIdMatch[1] : null

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          <span>Vaulto</span>
          <span className="sep">/</span>
          <span className="current">{label}</span>
        </div>

        <div className="topbar-actions">
          <div className="search-wrap">
            <Search size={13} className="search-icon" />
            <input
              className="search-bar"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value)
                handleSearch(e.target.value)
              }}
            />
          </div>

          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => {}}
          >
            <Bell size={14} />
          </button>

          <Button
            size="sm"
            onClick={() => projectId ? setShowCreateSecret(true) : navigate('/projects')}
          >
            <Plus size={13} /> New Secret
          </Button>
        </div>
      </header>

      {showCreateSecret && projectId && (
        <CreateSecretModal
          open={showCreateSecret}
          onClose={() => setShowCreateSecret(false)}
          projectId={projectId}
        />
      )}
    </>
  )
}
