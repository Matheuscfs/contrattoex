import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface VerificationFormProps {
  onSubmit: (code: string) => Promise<void>
  onResend: () => Promise<void>
  loading: boolean
}

export function VerificationForm({
  onSubmit,
  onResend,
  loading,
}: VerificationFormProps) {
  const [code, setCode] = useState('')
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(code)
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await onResend()
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Código de verificação</Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
          required
          placeholder="Digite o código recebido por email"
          maxLength={6}
          className="text-center text-2xl tracking-widest"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Verificando...' : 'Verificar'}
      </Button>

      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={handleResend}
        disabled={resending || loading}
      >
        {resending ? 'Reenviando...' : 'Reenviar código'}
      </Button>
    </form>
  )
} 