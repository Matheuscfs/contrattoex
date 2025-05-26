'use client'

import { createContext, useContext, useEffect } from 'react'
import { useCategorias } from '@/hooks/use-categorias'

interface CategoriasContextData {
  categorias: string[]
  isLoading: boolean
}

const CategoriasContext = createContext<CategoriasContextData>({} as CategoriasContextData)

export function CategoriasProvider({ children }: { children: React.ReactNode }) {
  const { categorias, isLoading, loadCategorias } = useCategorias()

  useEffect(() => {
    loadCategorias()
  }, [loadCategorias])

  return (
    <CategoriasContext.Provider
      value={{
        categorias,
        isLoading,
      }}
    >
      {children}
    </CategoriasContext.Provider>
  )
}

export function useCategoriasContext() {
  const context = useContext(CategoriasContext)

  if (!context) {
    throw new Error('useCategoriasContext must be used within a CategoriasProvider')
  }

  return context
} 