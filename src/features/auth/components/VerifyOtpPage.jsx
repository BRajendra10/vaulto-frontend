import { useDispatch } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock } from 'lucide-react'
import { useVerifyOtp } from '../hooks/useAuth'
import { resendOtp } from '../../../store/authSlice'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import toast from 'react-hot-toast'

const schema = z.object({
  otp: z.string().length(6, 'Must be exactly 6 digits'),
})

export default function VerifyOtpPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { mutate, isPending } = useVerifyOtp()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await mutate({ email: state?.email, otp: data.otp })
      navigate('/dashboard')
    } catch (_) {}
  }

  const handleResend = async () => {
    if (!state?.email) {
      toast.error('Email not found, go back and register again')
      return
    }
    const result = await dispatch(resendOtp(state.email))
    if (resendOtp.fulfilled.match(result)) {
      toast.success('New OTP sent to your email')
    } else {
      toast.error(result.payload || 'Failed to resend OTP')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Lock size={22} color="#fff" /></div>
          <span className="auth-logo-text">Vault<span>o</span></span>
        </div>
        <h1 className="auth-heading">Verify your email</h1>
        <p className="auth-sub">
          We sent a 6-digit code to{' '}
          <strong style={{ color: 'var(--accent2)' }}>{state?.email || 'your email'}</strong>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Verification code"
            placeholder="000000"
            maxLength={6}
            mono
            style={{ textAlign: 'center', fontSize: 22, letterSpacing: 8 }}
            error={errors.otp?.message}
            {...register('otp')}
          />
          <Button type="submit" loading={isPending} fullWidth style={{ marginTop: 8 }}>
            Verify &amp; continue
          </Button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button
            onClick={handleResend}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'var(--text2)',
            }}
          >
            Didn&apos;t receive it? Resend OTP
          </button>
        </div>

        <p className="auth-footer">
          <Link to="/login">← Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}