import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, FolderOpen, Users, AlertTriangle, Plus } from 'lucide-react'
import { useProjects, useCreateProject } from '../features/projects/hooks/useProjects'
import { useAuth } from '../features/auth/AuthContext'
import { EnvBadge } from '../components/ui/Badge'
import { CardSkeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatRelative } from '../lib/utils'

const schema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-_]+$/i, 'Only letters, numbers, hyphens, underscores'),
  description: z.string().optional(),
  environment: z.string(),
})

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const { data: list, isLoading, load } = useProjects()
  const { mutate, isPending } = useCreateProject()

  useEffect(() => { load() }, [load])

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { environment: 'development' },
  })

  const onSubmit = async (data) => {
    const project = await mutate(data)
    reset()
    setShowCreate(false)
    const id = project?.id || project?._id
    if (id) navigate(`/projects/${id}`)
  }

  const totalSecrets = list.reduce((a, p) => a + (p.secretsCount || 0), 0)
  const totalMembers = list.reduce((a, p) => a + (p.membersCount || 0), 0)
  const expiring = list.reduce((a, p) => a + (p.expiringCount || 0), 0)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">
            Good {getGreeting()}, {user?.firstName || user?.name?.split(' ')[0] || 'there'} 👋
          </div>
          <div className="page-subtitle">Here's what's happening in your vault</div>
        </div>
        <Button onClick={() => setShowCreate(true)}><Plus size={14} /> New Project</Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Secrets</div>
          <div className="stat-value">{totalSecrets}</div>
          <div className="stat-delta up">Across all projects</div>
          <div className="stat-icon"><KeyRound size={32} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Projects</div>
          <div className="stat-value">{list.length}</div>
          <div className="stat-delta up">Active workspaces</div>
          <div className="stat-icon"><FolderOpen size={32} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Team Members</div>
          <div className="stat-value">{totalMembers}</div>
          <div className="stat-delta">Across all projects</div>
          <div className="stat-icon"><Users size={32} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Expiring Soon</div>
          <div className="stat-value" style={{ color: expiring > 0 ? 'var(--amber)' : 'var(--text)' }}>{expiring}</div>
          <div className={`stat-delta ${expiring > 0 ? 'down' : ''}`}>
            {expiring > 0 ? '⚠ Needs attention' : 'All good'}
          </div>
          <div className="stat-icon"><AlertTriangle size={32} /></div>
        </div>
      </div>

      <div className="page-header" style={{ marginBottom: 16, marginTop: 8 }}>
        <span className="card-title">Recent Projects</span>
        <Link to="/projects" style={{ fontSize: 13, color: 'var(--accent2)', textDecoration: 'none' }}>View all →</Link>
      </div>

      {isLoading ? (
        <div className="projects-grid">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <div className="empty-title">No projects yet</div>
          <div className="empty-desc">Create your first project to start managing secrets</div>
          <Button onClick={() => setShowCreate(true)}><Plus size={14} /> Create Project</Button>
        </div>
      ) : (
        <div className="projects-grid">
          {list.slice(0, 8).map((p) => (
            <Link key={p.id || p._id} to={`/projects/${p.id || p._id}`} className="project-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="project-name">{p.name}</div>
                <EnvBadge env={p.environment || p.defaultEnvironment || 'development'} />
              </div>
              <div className="project-desc">{p.description || 'No description'}</div>
              <div className="project-meta">
                <div className="project-stats">
                  <span className="project-stat"><KeyRound size={11} /> {p.secretsCount ?? '—'}</span>
                  <span className="project-stat"><Users size={11} /> {p.membersCount ?? '—'}</span>
                </div>
                <span className="project-stat">{formatRelative(p.updatedAt || p.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => { setShowCreate(false); reset() }}
        title="📁 New Project"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowCreate(false); reset() }}>Cancel</Button>
            <Button loading={isPending} onClick={handleSubmit(onSubmit)}>Create Project</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Project name" placeholder="my-project" error={errors.name?.message} {...register('name')} />
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} placeholder="What is this project for?" {...register('description')} />
          </div>
          <div className="form-group">
            <label className="form-label">Default environment</label>
            <select className="form-select" {...register('environment')}>
              <option value="development">development</option>
              <option value="staging">staging</option>
              <option value="production">production</option>
            </select>
          </div>
        </form>
      </Modal>
    </>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
