import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../features/auth/AuthContext'
import { useUpdateProfile, useChangePassword } from '../features/auth/hooks/useAuth'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const profileSchema = z.object({
  username: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match", path: ['confirmPassword'],
})

export default function ProfilePage() {
  const { user, logoutAll, loggingOut } = useAuth()
  const { mutate: updateProfile, isPending: savingProfile } = useUpdateProfile()
  const { mutate: changePassword, isPending: changingPass } = useChangePassword()

  const profileForm = useForm({ resolver: zodResolver(profileSchema) })
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) })

  useEffect(() => {
    if (user) {
      profileForm.reset({ username: user.username || '' })
    }
  }, [user])

  const onProfileSubmit = async (data) => {
    try {
      await updateProfile({ username: data.username.trim() })
    } catch (_) { }
  }

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      passwordForm.reset()
    } catch (_) { }
  }

  const displayName = user?.username || user?.email || ''

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Profile &amp; Account</div>
          <div className="page-subtitle">Manage your personal settings</div>
        </div>
      </div>

      {/* Personal info */}
      <div className="profile-section">
        <div className="profile-section-header">Personal Information</div>
        <div className="profile-section-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Avatar
              src={user.avatar}
              className="w-10 h-10 ring-2 ring-stone-800"
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{displayName || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>{user?.email}</div>
            </div>
          </div>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <Input label="Full name" error={profileForm.formState.errors.username?.message} {...profileForm.register('username')} />
            <Input label="Email address" type="email" value={user?.email || ''} disabled />
            <Button type="submit" loading={savingProfile}>Save changes</Button>
          </form>
        </div>
      </div>

      {/* Change password */}
      <div className="profile-section">
        <div className="profile-section-header">Change Password</div>
        <div className="profile-section-body">
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <Input label="Current password" type="password" placeholder="••••••••"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="New password" type="password" placeholder="Min. 8 characters"
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register('newPassword')} />
              <Input label="Confirm password" type="password" placeholder="Repeat new password"
                error={passwordForm.formState.errors.confirmPassword?.message}
                {...passwordForm.register('confirmPassword')} />
            </div>
            <Button type="submit" loading={changingPass}>Update password</Button>
          </form>
        </div>
      </div>

      {/* Sessions */}
      <div className="profile-section">
        <div className="profile-section-header">Sessions</div>
        <div className="profile-section-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>Current session</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Signed in as {user?.email}</div>
            </div>
            <span className="badge badge-green">Active</span>
          </div>
          <Button variant="danger" size="sm" loading={loggingOut} onClick={logoutAll}>
            Logout all devices
          </Button>
        </div>
      </div>
    </>
  )
}
