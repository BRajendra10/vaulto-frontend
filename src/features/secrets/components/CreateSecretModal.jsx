import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useCreateSecret } from '../hooks/useSecrets'

const schema = z.object({
  key:         z.string().min(1, 'Key is required').regex(/^[A-Z0-9_]+$/, 'Uppercase, numbers and underscores only'),
  value:       z.string().min(1, 'Value is required'),
  environment: z.string(),
  expiresAt:   z.string().optional(),
})

export default function CreateSecretModal({ open, onClose, projectId }) {
  const { mutate, isPending } = useCreateSecret(projectId)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { environment: 'development' },
  })

  const onSubmit = async (data) => {
    try {
      await mutate({ key: data.key, value: data.value, environment: data.environment, expiresAt: data.expiresAt || undefined })
      reset()
      onClose()
    } catch (_) {}
  }

  const handleClose = () => { reset(); onClose() }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="🔑 Add Secret"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button loading={isPending} onClick={handleSubmit(onSubmit)}>Add Secret</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Key name" placeholder="DATABASE_URL" mono
          error={errors.key?.message}
          {...register('key')}
          onChange={e => setValue('key', e.target.value.toUpperCase().replace(/\s/g, '_'))}
        />
        <Input label="Value" type="password" placeholder="Enter secret value" mono error={errors.value?.message} {...register('value')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Environment</label>
            <select className="form-select" {...register('environment')}>
              <option value="development">development</option>
              <option value="staging">staging</option>
              <option value="production">production</option>
            </select>
          </div>
          <Input
            label={<>Expires at <span style={{ color: 'var(--text3)' }}>(optional)</span></>}
            type="date" error={errors.expiresAt?.message} {...register('expiresAt')}
          />
        </div>
      </form>
    </Modal>
  )
}
