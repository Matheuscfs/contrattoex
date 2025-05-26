import { useState, useCallback } from 'react'
import { Servico, getServicos } from '@/lib/services'
import { useAuth } from './use-auth'
import { useToast } from '@/components/ui/use-toast'

export function useServicos() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const loadServicos = useCallback(async () => {
    try {
      if (!user?.id) return

      const data = await getServicos(user.id)
      setServicos(data)
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, toast])

  const addServico = useCallback((servico: Servico) => {
    setServicos((prev) => [servico, ...prev])
  }, [])

  const updateServicoLocal = useCallback((servico: Servico) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === servico.id ? servico : s))
    )
  }, [])

  const removeServico = useCallback((id: string) => {
    setServicos((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return {
    servicos,
    isLoading,
    loadServicos,
    addServico,
    updateServicoLocal,
    removeServico,
  }
} 