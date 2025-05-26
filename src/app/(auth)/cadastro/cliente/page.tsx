'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthForm } from '@/components/auth/AuthForm'
import { VerificationForm } from '@/components/auth/VerificationForm'
import Link from 'next/link'

export default function CadastroClientePage() {
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [tempEmail, setTempEmail] = useState('')
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

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: 'customer',
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
            user_role: 'customer'
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

      setTempEmail(data.email)
      setVerifying(true)
      toast.success('Código de verificação enviado para seu email!')
    } catch (error: any) {
      console.error('Erro ao fazer cadastro:', error)
      
      // Tratamento específico de erros
      if (error.message?.includes('already registered')) {
        toast.error('Este e-mail já está cadastrado. Tente fazer login.')
      } else if (error.message?.includes('Invalid email')) {
        toast.error('E-mail inválido. Verifique o endereço informado.')
      } else if (error.message?.includes('Password')) {
        toast.error('Senha inválida. A senha deve ter no mínimo 6 caracteres.')
      } else if (error.message?.includes('Database error')) {
        toast.error('Erro interno do servidor. Tente novamente em alguns minutos.')
      } else {
        toast.error(error.message || 'Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (code: string) => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.verifyOtp({
        email: tempEmail,
        token: code,
        type: 'signup',
      })

      if (error) throw error

      toast.success('Email verificado com sucesso!')
      router.push('/entrar')
    } catch (error: any) {
      console.error('Erro ao verificar código:', error)
      toast.error('Código inválido ou expirado')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      const { error } = await supabase.auth.resend({
        email: tempEmail,
        type: 'signup',
      })

      if (error) throw error

      toast.success('Novo código enviado para seu email!')
    } catch (error: any) {
      console.error('Erro ao reenviar código:', error)
      toast.error('Erro ao reenviar código')
    }
  }

  return (
    <AuthLayout
      title={verifying ? 'Verificar Email' : 'Cadastro de Cliente'}
      subtitle={
        verifying
          ? 'Digite o código de verificação enviado para seu email'
          : 'Crie sua conta para começar a usar o iServiços'
      }
      backLink={
        verifying
          ? undefined
          : {
              href: '/entrar',
              text: 'Já tem uma conta? Faça login',
            }
      }
    >
      {verifying ? (
        <VerificationForm
          onSubmit={handleVerifyCode}
          onResend={handleResendCode}
          loading={loading}
        />
      ) : (
        <>
          <AuthForm
            type="register"
            loading={loading}
            onSubmit={handleSubmit}
            showName
            showConfirmPassword
          />

          <div className="text-center text-sm mt-4">
            <Link
              href="/cadastro/profissional-empresa"
              className="text-primary hover:text-primary/80"
            >
              Quero me cadastrar como profissional ou empresa
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  )
} 