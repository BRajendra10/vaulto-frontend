import {
  FolderOpen,
  KeyRound,
  Users,
  Database,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../features/auth/AuthContext'
import { useDashboard } from '../features/dashboard/hooks/useDashboard'

import Button from '../components/ui/Button'

import { EnvStatsCard } from '../features/dashboard/components/EnvStatsCard'
import { RecentProjectsTable } from '../features/dashboard/components/RecentProjectsTable'
import { StatCard } from '../features/dashboard/components/StatCard'

export default function DashboardPage() {
  const { user } = useAuth()

  const {
    data,
    loading,
    error,
  } = useDashboard()

  console.log(data);

  const totalProjects =
    data?.overview?.totalProjects ?? 0

  const totalSecrets =
    data?.overview?.totalSecrets ?? 0

  const totalMembers =
    data?.overview?.totalMembers ?? 0

  const environmentStats =
    data?.environmentStats ?? {
      development: 0,
      staging: 0,
      production: 0,
    }

  const recentProjects =
    data?.recentProjects ?? []

  const totalEnvironmentEntries =
    Object.values(environmentStats)
      .reduce((a, b) => a + (b || 0), 0)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">
            Good {getGreeting()},{' '}
            {user?.username?.split(' ')[0] || 'there'} 👋
          </div>

          <div className="page-subtitle">
            Here's what's happening in your vault
          </div>
        </div>

        <Button>
          <ShieldCheck size={14} />
          System Healthy
        </Button>
      </div>

      {error ? (
        <div className="card">
          <div className="profile-section-body">
            <div
              style={{
                color: 'var(--red)',
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Failed to load dashboard
            </div>

            <div
              style={{
                color: 'var(--text3)',
                fontSize: 13,
              }}
            >
              {typeof error === 'string'
                ? error
                : 'Something went wrong while loading dashboard data.'}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              title="Total Secrets"
              value={totalSecrets}
              loading={loading}
              delta="Across all projects"
              deltaType="up"
              icon={KeyRound}
            />

            <StatCard
              title="Projects"
              value={totalProjects}
              loading={loading}
              delta="Active workspaces"
              deltaType="up"
              icon={FolderOpen}
            />

            <StatCard
              title="Team Members"
              value={totalMembers}
              loading={loading}
              delta="Across all projects"
              icon={Users}
            />

            <StatCard
              title="Environment Entries"
              value={totalEnvironmentEntries}
              loading={loading}
              delta="Development, staging & production"
              icon={Database}
            />
          </div>

          <div
            className="page-header"
            style={{
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            <span className="card-title">
              Infrastructure Overview
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: 16,
              alignItems: 'start',
            }}
          >
            <EnvStatsCard
              environmentStats={environmentStats}
            />

            <RecentProjectsTable
              projects={recentProjects}
            />
          </div>
        </>
      )}
    </>
  )
}

function getGreeting() {
  const h = new Date().getHours()

  if (h < 12) return 'morning'

  if (h < 17) return 'afternoon'

  return 'evening'
}