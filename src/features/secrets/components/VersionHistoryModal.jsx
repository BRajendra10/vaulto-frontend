import { useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { useSecretVersions } from '../hooks/useSecrets'
import { Skeleton } from '../../../components/ui/Skeleton'
import { formatDate } from '../../../lib/utils'

export default function VersionHistoryModal({ open, onClose, projectId, secret }) {
  const secretId = secret?.id || secret?._id
  const { data: versions, load } = useSecretVersions(projectId, secretId)

  useEffect(() => {
    if (open && projectId && secretId) load()
  }, [open, projectId, secretId])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="🕐 Version History"
      size="lg"
      footer={<Button variant="ghost" onClick={onClose}>Close</Button>}
    >
      <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16, fontFamily: 'DM Mono' }}>
        {secret?.key} — metadata only, values are never shown
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Changed by</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {!versions.length ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text3)', padding: 24 }}>
                No version history available
              </td>
            </tr>
          ) : (
            versions.map((v, i) => (
              <tr key={v.id || v._id || i}>
                <td>
                  <span className="version-tag">v{v.version || versions.length - i}</span>
                  {i === 0 && <span className="badge badge-green" style={{ marginLeft: 6 }}>current</span>}
                </td>
                <td style={{ fontSize: 12, color: 'var(--text2)' }}>
                  {v.changedBy?.email || v.createdBy?.email || '—'}
                </td>
                <td style={{ fontSize: 12, color: 'var(--text3)' }}>{formatDate(v.createdAt)}</td>
                <td>
                  {i === 0
                    ? <span className="badge badge-green">Active</span>
                    : <span className="badge badge-gray">Archived</span>
                  }
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Modal>
  )
}
