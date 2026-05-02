import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock } from 'lucide-react'
import { useRegister } from '../hooks/useAuth'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

export default function RegisterPage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useRegister()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await mutate(data)
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (_) { }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Lock size={22} color="#fff" /></div>
          <span className="auth-logo-text">Vault<span>o</span></span>
        </div>
        <h1 className="auth-heading">Create account</h1>
        <p className="auth-sub">Start managing secrets securely</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="First name" placeholder="Jane" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last name" placeholder="Doe" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email address" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
          <Input label="Password" autoComplete="off" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />
          <Button type="submit" loading={isPending} fullWidth style={{ marginTop: 8 }}>
            Create account
          </Button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
