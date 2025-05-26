'use client'

import { createContext, useContext, useEffect } from 'react'
import { useServicos } from '@/hooks/use-servicos'
import { Servico } from '@/lib/services'

interface ServicosContextData {
  servicos: Servico[]
  isLoading: boolean
  addServico: (servico: Servico) => void
  updateServicoLocal: (servico: Servico) => void
  removeServico: (id: string) => void
}

const ServicosContext = createContext<ServicosContextData>({} as ServicosContextData)

export function ServicosProvider({ children }: { children: React.ReactNode }) {
  const {
    servicos,
    isLoading,
    loadServicos,
    addServico,
    updateServicoLocal,
    removeServico,
  } = useServicos()

  useEffect(() => {
    loadServicos()
  }, [loadServicos])

  return (
    <ServicosContext.Provider
      value={{
        servicos,
        isLoading,
        addServico,
        updateServicoLocal,
        removeServico,
      }}
    >
      {children}
    </ServicosContext.Provider>
  )
}

export function useServicosContext() {
  const context = useContext(ServicosContext)

  if (!context) {
    throw new Error('useServicosContext must be used within a ServicosProvider')
  }

  return context
} 