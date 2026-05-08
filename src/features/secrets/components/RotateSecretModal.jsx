import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useRotateSecret } from '../hooks/useSecrets'

const schema = z.object({
  value: z.string().min(1, 'New value is required'),
})

export default function RotateSecretModal({ open, onClose, projectId, secret }) {
  const { mutate, isPending } = useRotateSecret(projectId)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })
  console.log(secret)

  const onSubmit = async (data) => {
    try {
      await mutate({
        secretId:    secret.id || secret._id,
        value:       data.value,
        environment: secret.environment,   // pass environment from the existing secret
      })
      reset()
      onClose()
    } catch (_) {}
  }

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose() }}
      title="🔄 Rotate Secret"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => { reset(); onClose() }}>Cancel</Button>
          <Button loading={isPending} onClick={handleSubmit(onSubmit)}>Rotate</Button>
        </>
      }
    >
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
        Rotating{' '}
        <span style={{ color: 'var(--accent2)', fontFamily: 'DM Mono', fontSize: 12 }}>
          {secret?.key}
        </span>
        {' '}in{' '}
        <span style={{ color: 'var(--accent2)', fontFamily: 'DM Mono', fontSize: 12 }}>
          {secret?.environment}
        </span>
        . A new version will be created and the old value archived.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New value"
          type="password"
          placeholder="Enter new secret value"
          mono
          error={errors.value?.message}
          {...register('value')}
        />
      </form>
    </Modal>
  )
}
