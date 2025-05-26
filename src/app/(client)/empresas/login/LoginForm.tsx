'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success('Login realizado com sucesso!')
      router.push('/empresas/dashboard')
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      toast.error('Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="iServiços" width={150} height={40} />
        </Link>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Faça login na sua conta</h1>
            <p className="text-gray-500 mt-2">
              Não tem uma conta?{' '}
              <Link href="/empresas/cadastro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </Button>

          <div className="text-center">
            <Link href="/empresas/recuperar-senha" className="text-sm text-gray-500 hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
} 