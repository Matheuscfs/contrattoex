import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface AuthFormProps {
  onSubmit: (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  type: 'login' | 'register'
  loading: boolean
  showName?: boolean
  showConfirmPassword?: boolean
}

export function AuthForm({
  onSubmit,
  type,
  loading,
  showName = false,
  showConfirmPassword = false,
}: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ name, email, password, confirmPassword })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showName && (
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {showConfirmPassword && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? type === 'login'
            ? 'Entrando...'
            : 'Cadastrando...'
          : type === 'login'
          ? 'Entrar'
          : 'Cadastrar'}
      </Button>
    </form>
  )
} 