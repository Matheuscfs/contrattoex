'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Se não está logado, redirecionar para login
        router.push('/entrar')
        return
      }

      // Determinar o role do usuário
      const userRole = profile?.role || user.user_metadata?.role || 'customer'
      
      console.log('Redirecionando usuário do dashboard principal:', { userRole, userId: user.id })

      // Redirecionar para o dashboard apropriado
      if (userRole === 'business') {
        router.push('/dashboard/empresa')
      } else if (userRole === 'professional') {
        router.push('/dashboard/profissional')
      } else {
        // customer ou qualquer outro role
        router.push('/dashboard/cliente')
      }
    }
  }, [user, profile, loading, router])

  // Mostrar loading enquanto determina o redirecionamento
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Redirecionando para seu dashboard...</span>
      </div>
    </div>
  )
} 