import { useEffect, useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, KeyRound, Users } from 'lucide-react'
import { useProjects, useCreateProject } from '../features/projects/hooks/useProjects'
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
  name: z.string().min(1, 'Name is required').regex(/^[a-z0-9-_]+$/i, 'Only letters, numbers, hyphens'),
  description: z.string().max(300, 'Description must be at most 300 characters').optional(),
  environment: z.string(),
})

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const timer = useRef(null)

  const { data: list, isLoading, load } = useProjects()
  const { mutate, isPending } = useCreateProject()

  useEffect(() => { load() }, [load])

  // Search handler - not being used because there is no route for search
  const handleSearch = useCallback((val) => {
    setSearch(val)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => console.log("Search :", val), 300)
  }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { environment: 'development' },
  })

  const onSubmit = async (data) => {
    const project = await mutate(data)
    reset(); setShowCreate(false)
    const id = project?.id || project?._id
    if (id) navigate(`/projects/${id}`)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Projects</div>
          {/* <div className="page-subtitle">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</div> */}
        </div>
        <Button onClick={() => setShowCreate(true)}><Plus size={14} /> New Project</Button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={13} className="search-icon" />
          <input
            className="search-bar" style={{ width: '100%' }}
            placeholder="Search projects..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="projects-grid">{[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : list?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <div className="empty-title">{search ? 'No results found' : 'No projects yet'}</div>
          <div className="empty-desc">{search ? `No projects matching "${search}"` : 'Create your first project'}</div>
          {!search && <Button onClick={() => setShowCreate(true)}><Plus size={14} /> Create Project</Button>}
        </div>
      ) : (
        <div className="projects-grid">
          {list?.map((p) => (
            <Link key={p.id || p._id} to={`/projects/${p.id || p._id}`} className="project-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="project-name">{p.project_name}</div>
              </div>
              <div className="project-desc">{p.description || 'No description'}</div>
              <div className="project-meta">
                <div className="project-stats">
                  <span className="project-stat"><KeyRound size={11} /> {p.secretsCount ?? '—'}</span>
                  <span className="project-stat"><Users size={11} /> {p.membersCount ?? '—'}</span>
                </div>
                <span className="project-stat">{formatRelative(p.updated_at || p.created_at)}</span>
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
            <textarea className="form-textarea" rows={3} maxLength={300} placeholder="What is this project for? (optional)" {...register('description')} />
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
