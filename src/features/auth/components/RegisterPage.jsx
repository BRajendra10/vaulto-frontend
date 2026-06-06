import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock } from 'lucide-react'
import { useRegister } from '../hooks/useAuth'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const schema = z.object({
  username: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
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
      await mutate({
        username: data.username.trim(),
        email: data.email,
        password: data.password,
      })
      // navigate('/verify-otp', { state: { email: data.email } })
      navigate('/login');
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
          <Input label="Full name" placeholder="Rajendra Behera" error={errors.username?.message} {...register('username')} />
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
