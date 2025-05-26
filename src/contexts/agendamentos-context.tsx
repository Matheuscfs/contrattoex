'use client'

import { createContext, useContext, useEffect } from 'react'
import { useAgendamentos } from '@/hooks/use-agendamentos'
import { Agendamento } from '@/lib/agendamentos'

interface AgendamentosContextData {
  agendamentos: Agendamento[]
  isLoading: boolean
  loadAgendamentos: (filtros?: {
    status?: Agendamento['status']
    dataInicio?: Date
    dataFim?: Date
  }) => Promise<void>
  atualizarStatus: (agendamentoId: string, novoStatus: Agendamento['status']) => Promise<void>
  addAgendamento: (agendamento: Agendamento) => void
  updateAgendamentoLocal: (agendamento: Agendamento) => void
  removeAgendamento: (id: string) => void
}

interface AgendamentosProviderProps {
  children: React.ReactNode
  tipo?: 'empresa' | 'cliente'
}

const AgendamentosContext = createContext<AgendamentosContextData>({} as AgendamentosContextData)

export function AgendamentosProvider({ children, tipo = 'empresa' }: AgendamentosProviderProps) {
  const {
    agendamentos,
    isLoading,
    loadAgendamentos,
    atualizarStatus,
    addAgendamento,
    updateAgendamentoLocal,
    removeAgendamento,
  } = useAgendamentos(tipo)

  useEffect(() => {
    loadAgendamentos()
  }, [loadAgendamentos])

  return (
    <AgendamentosContext.Provider
      value={{
        agendamentos,
        isLoading,
        loadAgendamentos,
        atualizarStatus,
        addAgendamento,
        updateAgendamentoLocal,
        removeAgendamento,
      }}
    >
      {children}
    </AgendamentosContext.Provider>
  )
}

export function useAgendamentosContext() {
  const context = useContext(AgendamentosContext)

  if (!context) {
    throw new Error('useAgendamentosContext must be used within a AgendamentosProvider')
  }

  return context
} 