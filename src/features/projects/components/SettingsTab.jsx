import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateProject, useDeleteProject } from '../hooks/useProjects'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(300, 'Description must be at most 300 characters').optional(),
  environment: z.string(),
})

export default function SettingsTab({ projectId, project }) {
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const { mutate: updateProject, isPending: saving } = useUpdateProject(projectId)
  const { mutate: deleteProject, isPending: deleting } = useDeleteProject(projectId)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (project) {
      reset({
        name: project.project_name || '',
        description: project.description || '',
        environment: project.environment || project.defaultEnvironment || 'development',
      })
    }
  }, [project, reset])

  const onSubmit = async (data) => {
    try { await updateProject(data) } catch (_) { }
  }

  const handleDelete = async () => {
    try {
      await deleteProject()
      navigate('/projects')
    } catch (_) { }
  }

  return (
    <>
      <div className="profile-section" style={{ marginBottom: 20 }}>
        <div className="profile-section-header">General</div>
        <div className="profile-section-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Project name" error={errors.name?.message} {...register('name')} />
              <div className="form-group">
                <label className="form-label">Default environment</label>
                <select className="form-select" {...register('environment')}>
                  <option value="development">development</option>
                  <option value="staging">staging</option>
                  <option value="production">production</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} maxLength={300} placeholder="Short description (optional)" {...register('description')} />
            </div>
            <Button type="submit" loading={saving}>Save changes</Button>
          </form>
        </div>
      </div>

      <div className="profile-section" style={{ marginBottom: 20 }}>
        <div className="profile-section-header">API Access</div>

        <div className="profile-section-body">
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 16,
              background: 'var(--surface2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Project API Key
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text3)',
                    marginTop: 4,
                  }}
                >
                  Use this key to authenticate SDKs, CLI tools, or external services.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowApiKey(prev => !prev)}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(project?.api_key || '')
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 13,
                padding: 12,
                borderRadius: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                wordBreak: 'break-all',
                color: 'var(--text2)',
              }}
            >
              {showApiKey
                ? project?.api_key
                : '••••••••••••••••••••••••••••••••••••••••••••••••'}
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: '#f59e0b',
              }}
            >
              Never expose this key publicly or commit it to Git repositories.
            </div>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <div className="danger-zone-header">⚠ Danger Zone</div>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>Delete project</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              Permanently delete this project and all its secrets.
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
            Delete project
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Project"
        message={`Delete "${project?.project_name}"? All secrets and audit logs will be permanently removed.`}
        confirmLabel="Delete project"
      />
    </>
  )
}
