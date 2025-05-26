'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardProfissionalPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/entrar')
        return
      }

      // Verificar se o usuário é realmente um profissional
      const userRole = profile?.role || user.user_metadata?.role
      if (userRole !== 'professional') {
        // Se não é profissional, redirecionar para o dashboard correto
        router.push('/dashboard')
        return
      }
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard do Profissional</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {profile?.name || user.user_metadata?.name || 'Profissional'}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Meus Serviços</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Gerencie seus serviços oferecidos
          </p>
          <button 
            onClick={() => router.push('/dashboard/servicos')}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Ver Serviços
          </button>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Agenda</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Visualize seus agendamentos
          </p>
          <button 
            onClick={() => router.push('/profissional/agenda')}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Ver Agenda
          </button>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Perfil</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Atualize suas informações
          </p>
          <button 
            onClick={() => router.push('/profissional/perfil')}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  )
} 