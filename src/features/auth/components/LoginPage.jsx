import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useLogin } from '../hooks/useAuth'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useLogin()
  const [showPass, setShowPass] = useState(false)

  const { user } = useSelector(s => s.auth)

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [navigate, user])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await mutate(data)
      navigate('/dashboard')
    } catch (e) { }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Lock size={22} color="#fff" /></div>
          <span className="auth-logo-text">Vault<span>o</span></span>
        </div>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to access your vault</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="off"
            error={errors.password?.message}
            suffix={
              <button type="button" onClick={() => setShowPass(p => !p)} className="icon-btn">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
            {...register('password')}
          />
          <Button type="submit" loading={isPending} fullWidth style={{ marginTop: 8 }}>
            Sign in
          </Button>
        </form>
        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
