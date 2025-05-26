import { useState, useCallback } from 'react'
import { useAuth } from './use-auth'
import { useToast } from '@/components/ui/use-toast'
import {
  Agendamento,
  getAgendamentosEmpresa,
  getAgendamentosCliente,
  updateAgendamento,
} from '@/lib/agendamentos'

export function useAgendamentos(tipo: 'empresa' | 'cliente' = 'empresa') {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const loadAgendamentos = useCallback(async (filtros?: {
    status?: Agendamento['status']
    dataInicio?: Date
    dataFim?: Date
  }) => {
    try {
      if (!user?.id) return

      const data = tipo === 'empresa'
        ? await getAgendamentosEmpresa(user.id, filtros)
        : await getAgendamentosCliente(user.id, filtros)

      setAgendamentos(data)
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os agendamentos.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, tipo, toast])

  const atualizarStatus = useCallback(async (
    agendamentoId: string,
    novoStatus: Agendamento['status']
  ) => {
    try {
      const agendamentoAtualizado = await updateAgendamento(agendamentoId, {
        status: novoStatus,
      })

      setAgendamentos(prev =>
        prev.map(a => (a.id === agendamentoId ? agendamentoAtualizado : a))
      )

      toast({
        title: 'Sucesso',
        description: 'Status do agendamento atualizado com sucesso!',
      })
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do agendamento.',
        variant: 'destructive',
      })
      throw error
    }
  }, [toast])

  const addAgendamento = useCallback((agendamento: Agendamento) => {
    setAgendamentos(prev => [agendamento, ...prev])
  }, [])

  const updateAgendamentoLocal = useCallback((agendamento: Agendamento) => {
    setAgendamentos(prev =>
      prev.map(a => (a.id === agendamento.id ? agendamento : a))
    )
  }, [])

  const removeAgendamento = useCallback((id: string) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id))
  }, [])

  return {
    agendamentos,
    isLoading,
    loadAgendamentos,
    atualizarStatus,
    addAgendamento,
    updateAgendamentoLocal,
    removeAgendamento,
  }
} 