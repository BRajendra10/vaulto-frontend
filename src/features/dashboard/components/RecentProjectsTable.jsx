import { formatRelative } from '../../../lib/utils'

export function RecentProjectsTable({ projects }) {
  const rows = projects || []

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">
            Recent Projects
          </div>

          <div
            style={{
              fontSize: 12,
              color: 'var(--text3)',
              marginTop: 2,
            }}
          >
            Projects created in the last 7 days
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">
            No recent projects
          </div>

          <div className="empty-desc">
            Newly created projects will appear here.
          </div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Description</th>
                <th>Owner</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((project) => (
                <tr key={project.id}>
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: 'var(--text)',
                      }}
                    >
                      {project.project_name}
                    </div>
                  </td>

                  <td
                    style={{
                      maxWidth: 280,
                    }}
                  >
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--text2)',
                      }}
                    >
                      {project.description || 'No description'}
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-purple">
                      #{project.owner_id}
                    </span>
                  </td>

                  <td
                    style={{
                      color: 'var(--text3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatRelative(project.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}