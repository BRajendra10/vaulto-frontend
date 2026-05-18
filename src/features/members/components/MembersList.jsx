import { useEffect, useMemo, useState } from 'react'
import { UserPlus } from 'lucide-react'
import {
  useMaintainers,
  useUpdateMaintainerRole,
  useRemoveMaintainer,
} from '../hooks/useMembers'

import { useAuth } from '../../../features/auth/AuthContext'
import { RoleBadge } from '../../../components/ui/Badge'
import { Skeleton } from '../../../components/ui/Skeleton'
import Button from '../../../components/ui/Button'
import Avatar from '../../../components/ui/Avatar'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import AddMemberModal from './AddMemberModal'
import { canManage } from '../../../lib/utils'

export default function MembersList({ projectId }) {
  const { user } = useAuth()

  const {
    data: list = [],
    isLoading,
    load,
  } = useMaintainers(projectId)

  const { mutate: updateRole } =
    useUpdateMaintainerRole(projectId)

  const {
    mutate: removeMember,
    isPending: removing,
  } = useRemoveMaintainer(projectId)

  const [showAdd, setShowAdd] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)

  useEffect(() => {
    load()
  }, [load])

  // derive current user's project membership
  const myMembership = useMemo(() => {
    return list.find(
      (m) =>
        m.user_id === user?.id ||
        m.email === user?.email
    )
  }, [list, user])

  const myRole = myMembership?.role || 'viewer'

  const canInvite = ['owner', 'admin'].includes(myRole)

  const handleRoleChange = async (userId, role) => {
    // Backend expects :userId (users.id), not the maintainer row id
    await updateRole({ userId, role })
  }

  const handleRemove = async () => {
    // Backend expects :userId (users.id), not the maintainer row id
    await removeMember(removeTarget.user_id)
    setRemoveTarget(null)
  }

  return (
    <>
      <div
        className="page-header"
        style={{ marginBottom: 16 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span className="card-title">
            Team Members
          </span>

          {!isLoading && (
            <span className="tab-count">
              {list.length}
            </span>
          )}
        </div>

        {canInvite && (
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
          >
            <UserPlus size={13} />
            Invite Member
          </Button>
        )}
      </div>

      <div className="card">
        {isLoading ? (
          <div style={{ padding: '12px 16px' }}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom:
                    '1px solid rgba(120,120,180,0.06)',
                }}
              >
                <Skeleton
                  width={34}
                  height={34}
                  style={{ borderRadius: '50%' }}
                />

                <div style={{ flex: 1 }}>
                  <Skeleton
                    width={120}
                    height={14}
                    style={{ marginBottom: 6 }}
                  />

                  <Skeleton
                    width={180}
                    height={12}
                  />
                </div>

                <Skeleton
                  width={60}
                  height={20}
                  style={{ borderRadius: 20 }}
                />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>

            <div className="empty-title">
              No members yet
            </div>

            <div className="empty-desc">
              Invite team members to collaborate
            </div>

            {canInvite && (
              <Button
                onClick={() => setShowAdd(true)}
              >
                <UserPlus size={14} />
                Invite Member
              </Button>
            )}
          </div>
        ) : (
          list.map((m) => {
            const memberId = m.id
            const memberRole = m.role

            const isMe =
              m.user_id === user?.id ||
              m.email === user?.email

            const canEdit =
              !isMe &&
              canManage(myRole, memberRole)

            console.log({
              myRole,
              memberRole,
              canEdit,
              isMe,
            })

            return (
              <div
                key={memberId}
                className="member-row"
              >
                <Avatar
                  src={m.avatar}
                  name={m.email}
                  className="w-10 h-10 ring-2 ring-stone-800"
                />

                <div className="member-info">
                  <div className="member-name">
                    {m.name || m.email}

                    {isMe && (
                      <span
                        style={{
                          fontSize: 11,
                          color: 'var(--text3)',
                          marginLeft: 6,
                        }}
                      >
                        (you)
                      </span>
                    )}
                  </div>

                  <div className="member-email">
                    {m.email}
                  </div>
                </div>

                {canEdit ? (
                  <select
                    className="form-select"
                    style={{
                      width: 'auto',
                      fontSize: 12,
                      padding: '4px 8px',
                    }}
                    value={memberRole}
                    onChange={(e) =>
                      handleRoleChange(
                        m.user_id,
                        e.target.value
                      )
                    }
                  >
                    <option value="admin">
                      admin
                    </option>

                    <option value="developer">
                      developer
                    </option>

                    <option value="viewer">
                      viewer
                    </option>
                  </select>
                ) : (
                  <RoleBadge role={memberRole} />
                )}

                {canEdit && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      setRemoveTarget(m)
                    }
                  >
                    Remove
                  </Button>
                )}

                {memberRole === 'owner' && (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--text3)',
                      marginLeft: 4,
                    }}
                  >
                    Owner
                  </span>
                )}
              </div>
            )
          })
        )}
      </div>

      <AddMemberModal
        open={showAdd}
        onClose={() => {
          setShowAdd(false)
          load()
        }}
        projectId={projectId}
      />

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        loading={removing}
        title="Remove Member"
        message={`Remove ${removeTarget?.name ||
          removeTarget?.email
          } from this project?`}
        confirmLabel="Remove"
      />
    </>
  )
}