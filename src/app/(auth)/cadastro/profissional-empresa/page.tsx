'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthForm } from '@/components/auth/AuthForm'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function CadastroProfissionalEmpresaPage() {
  const [userType, setUserType] = useState<'professional' | 'business'>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    try {
      setLoading(true)

      // Validações
      if (!data.name.trim()) {
        toast.error('O nome é obrigatório')
        return
      }

      if (!data.email.trim()) {
        toast.error('O e-mail é obrigatório')
        return
      }

      if (!data.password) {
        toast.error('A senha é obrigatória')
        return
      }

      if (data.password.length < 6) {
        toast.error('A senha deve ter no mínimo 6 caracteres')
        return
      }

      if (data.password !== data.confirmPassword) {
        toast.error('As senhas não coincidem')
        return
      }

      if (!userType) {
        toast.error('Selecione o tipo de usuário')
        return
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: userType,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // Criar perfil manualmente após criação do usuário
      if (authData.user) {
        try {
          const { error: profileError } = await supabase.rpc('create_user_profile', {
            user_id: authData.user.id,
            user_email: data.email,
            user_name: data.name,
            user_role: userType
          });

          if (profileError) {
            console.error('Erro ao criar perfil:', profileError);
            // Não bloquear o fluxo se o perfil falhar
          }
        } catch (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          // Não bloquear o fluxo se o perfil falhar
        }
      }

      toast.success('Cadastro realizado com sucesso! Verifique seu email.')
      router.push('/entrar')
    } catch (error: any) {
      console.error('Erro ao fazer cadastro:', error)
      toast.error('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Cadastro Profissional/Empresa"
      subtitle="Crie sua conta para começar a oferecer seus serviços"
      backLink={{
        href: '/entrar',
        text: 'Já tem uma conta? Faça login'
      }}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="userType">Tipo de usuário</Label>
          <Select
            value={userType}
            onValueChange={(value: 'professional' | 'business') => setUserType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Profissional</SelectItem>
              <SelectItem value="business">Empresa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AuthForm
          type="register"
          loading={loading}
          onSubmit={handleSubmit}
          showName
          showConfirmPassword
        />

        <div className="text-center text-sm">
          <Link
            href="/cadastro/cliente"
            className="text-primary hover:text-primary/80"
          >
            Quero me cadastrar como cliente
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
} 