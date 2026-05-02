import { useEffect, useState } from 'react'
import { Eye, EyeOff, Copy, RotateCw, Clock, Trash2, Plus } from 'lucide-react'
import { useSecrets, useRevealedValues, useRevealSecret, useHideSecret, useDeleteSecret } from '../hooks/useSecrets'
import { EnvBadge } from '../../../components/ui/Badge'
import { TableSkeleton } from '../../../components/ui/Skeleton'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import CreateSecretModal from './CreateSecretModal'
import RotateSecretModal from './RotateSecretModal'
import VersionHistoryModal from './VersionHistoryModal'
import { formatRelative } from '../../../lib/utils'
import toast from 'react-hot-toast'

const ENVS = ['all', 'development', 'staging', 'production']

export default function SecretsTable({ projectId }) {
  const [env, setEnv] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [rotateTarget, setRotateTarget] = useState(null)
  const [historyTarget, setHistoryTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: list, isLoading, load } = useSecrets(projectId, env === 'all' ? null : env)
  const revealedValues = useRevealedValues()
  const { mutate: reveal } = useRevealSecret(projectId)
  const hideSecret = useHideSecret()
  const { mutate: deleteSecret, isPending: deleting } = useDeleteSecret(projectId)

  useEffect(() => { load() }, [load])

  const handleReveal = async (secretId) => {
    if (revealedValues[secretId]) {
      hideSecret(secretId)
      return
    }
    await reveal(secretId)
  }

  const handleCopy = async (secretId, key) => {
    const val = revealedValues[secretId]
    if (!val) { toast.error('Reveal the secret first to copy it'); return }
    await navigator.clipboard.writeText(val)
    toast.success(`${key} copied to clipboard`)
  }

  const handleDelete = async () => {
    await deleteSecret(deleteTarget.id || deleteTarget._id)
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div />
        <Button onClick={() => setShowCreate(true)}><Plus size={14} /> Add Secret</Button>
      </div>

      <div className="filter-bar">
        <div className="env-filter">
          {ENVS.map(e => (
            <button
              key={e}
              className={`env-chip${env === e ? ' active' : ''}`}
              onClick={() => { setEnv(e); load() }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Key</th><th>Value</th><th>Environment</th>
              <th>Version</th><th>Status</th><th>Updated</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={5} cols={7} />
            ) : list.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <div className="empty-icon">🔑</div>
                  <div className="empty-title">No secrets yet</div>
                  <div className="empty-desc">{env !== 'all' ? `No secrets in ${env}` : 'Add your first secret'}</div>
                  <Button onClick={() => setShowCreate(true)}><Plus size={14} /> Add Secret</Button>
                </div>
              </td></tr>
            ) : (
              list.map((s) => {
                const id = s.id || s._id
                const isRevealed = !!revealedValues[id]
                const isExpiring = s.status === 'expiring' ||
                  (s.expiresAt && new Date(s.expiresAt) < new Date(Date.now() + 7 * 24 * 3600 * 1000))

                return (
                  <tr key={id}>
                    <td><span style={{ fontFamily: 'DM Mono', fontSize: 12.5, color: 'var(--accent2)' }}>{s.key}</span></td>
                    <td>
                      <div className="secret-value">
                        {isRevealed
                          ? <span className="secret-revealed">{revealedValues[id]}</span>
                          : <span className="secret-mask">••••••••••••</span>
                        }
                        <button className={`icon-btn${isRevealed ? ' active' : ''}`} title={isRevealed ? 'Hide' : 'Reveal'} onClick={() => handleReveal(id)}>
                          {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button className="icon-btn" title="Copy" onClick={() => handleCopy(id, s.key)}>
                          <Copy size={13} />
                        </button>
                      </div>
                    </td>
                    <td><EnvBadge env={s.environment} /></td>
                    <td><span className="version-tag">v{s.version || 1}</span></td>
                    <td>{isExpiring ? <span className="badge badge-amber">⚠ Expiring</span> : <span className="badge badge-green">Active</span>}</td>
                    <td style={{ color: 'var(--text3)', fontSize: 12 }}>{formatRelative(s.updatedAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="icon-btn" title="Rotate" onClick={() => setRotateTarget(s)}><RotateCw size={13} /></button>
                        <button className="icon-btn" title="History" onClick={() => setHistoryTarget(s)}><Clock size={13} /></button>
                        <button className="icon-btn" title="Delete" style={{ color: 'var(--red)' }} onClick={() => setDeleteTarget(s)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <CreateSecretModal open={showCreate} onClose={() => { setShowCreate(false); load() }} projectId={projectId} />
      {rotateTarget && <RotateSecretModal open={!!rotateTarget} onClose={() => { setRotateTarget(null); load() }} projectId={projectId} secret={rotateTarget} />}
      {historyTarget && <VersionHistoryModal open={!!historyTarget} onClose={() => setHistoryTarget(null)} projectId={projectId} secret={historyTarget} />}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Secret" message={`Delete "${deleteTarget?.key}"? This can be reversed by an admin.`} confirmLabel="Delete" />
    </>
  )
}
