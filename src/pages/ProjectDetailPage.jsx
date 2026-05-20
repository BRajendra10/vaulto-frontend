import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { KeyRound, Users, ScrollText, Settings } from 'lucide-react'
import { useProject } from '../features/projects/hooks/useProjects'
import { Skeleton } from '../components/ui/Skeleton'
import SecretsTable from '../features/secrets/components/SecretsTable'
import MembersList from '../features/members/components/MembersList'
import AuditLogList from '../features/audit/components/AuditLogList'
import SettingsTab from '../features/projects/components/SettingsTab'

const TABS = [
  { key: 'secrets', label: 'Secrets', icon: KeyRound },
  { key: 'members', label: 'Members', icon: Users },
  { key: 'audit', label: 'Audit Logs', icon: ScrollText },
  { key: 'settings', label: 'Settings', icon: Settings },
]

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState('secrets')
  const { data: project, isLoading, load } = useProject(projectId)

  useEffect(() => { load() }, [load])

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">
            {isLoading ? <Skeleton width={160} height={24} /> : project?.project_name || 'Project'}
          </div>
          <div className="page-subtitle">
            {isLoading
              ? <Skeleton width={240} height={14} style={{ marginTop: 6 }} />
              : project?.description || 'Manage your secrets and team'}
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`tab${activeTab === key ? ' active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'secrets' && <SecretsTable projectId={projectId} />}
      {activeTab === 'members' && <MembersList projectId={projectId} />}
      {activeTab === 'audit' && <AuditLogList projectId={projectId} />}
      {activeTab === 'settings' && <SettingsTab projectId={projectId} project={project} />}
    </>
  )
}
