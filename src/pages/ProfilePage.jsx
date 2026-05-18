import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../features/auth/AuthContext'
import { useUpdateProfile, useChangePassword } from '../features/auth/hooks/useAuth'
import { RoleBadge } from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
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
      profileForm.reset({
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ')[1] || '',
        email: user.email || '',
      })
    }
  }, [user])

  const onProfileSubmit = async (data) => {
    try { await updateProfile(data) } catch (_) { }
  }

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      passwordForm.reset()
    } catch (_) { }
  }

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email
    : ''

    console.log(user)

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
              <div style={{ fontSize: 16, fontWeight: 600 }}>{fullName || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>{user?.email}</div>
            </div>
          </div>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="First name" error={profileForm.formState.errors.firstName?.message} {...profileForm.register('firstName')} />
              <Input label="Last name" error={profileForm.formState.errors.lastName?.message}  {...profileForm.register('lastName')} />
            </div>
            <Input label="Email address" type="email" error={profileForm.formState.errors.email?.message} {...profileForm.register('email')} />
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
