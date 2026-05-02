import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useAddMaintainer } from '../hooks/useMembers'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  role:  z.enum(['developer', 'viewer']),
})

export default function AddMemberModal({ open, onClose, projectId }) {
  const { mutate, isPending } = useAddMaintainer(projectId)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'developer' },
  })

  const onSubmit = async (data) => {
    try {
      await mutate(data)
      reset(); onClose()
    } catch (_) {}
  }

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose() }}
      title="👥 Invite Member"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => { reset(); onClose() }}>Cancel</Button>
          <Button loading={isPending} onClick={handleSubmit(onSubmit)}>Send Invite</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email address" type="email" placeholder="colleague@company.com" error={errors.email?.message} {...register('email')} />
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-select" {...register('role')}>
            <option value="developer">developer</option>
            <option value="viewer">viewer</option>
          </select>
        </div>
        <div style={{ padding: '10px 12px', background: 'var(--amber-bg)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--amber)', marginTop: 4 }}>
          ⚠ As an admin, you can only assign developer or viewer roles.
        </div>
      </form>
    </Modal>
  )
}
