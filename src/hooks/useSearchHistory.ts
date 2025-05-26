import { useState, useEffect } from 'react'

const MAX_HISTORY_ITEMS = 10

interface SearchHistoryItem {
  term: string
  timestamp: number
  type: 'empresa' | 'servico' | 'profissional' | 'promocao'
}

export function useSearchHistory(type: SearchHistoryItem['type']) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])

  useEffect(() => {
    // Carrega o histórico do localStorage ao montar o componente
    const savedHistory = localStorage.getItem(`searchHistory_${type}`)
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [type])

  const addToHistory = (term: string) => {
    if (!term.trim()) return

    setHistory(prev => {
      // Remove o termo se já existir
      const filtered = prev.filter(item => item.term !== term)
      
      // Adiciona o novo termo no início
      const newHistory = [
        { term, timestamp: Date.now(), type },
        ...filtered
      ].slice(0, MAX_HISTORY_ITEMS) // Mantém apenas os últimos N itens

      // Salva no localStorage
      localStorage.setItem(`searchHistory_${type}`, JSON.stringify(newHistory))
      
      return newHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(`searchHistory_${type}`)
  }

  const removeFromHistory = (term: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.term !== term)
      localStorage.setItem(`searchHistory_${type}`, JSON.stringify(newHistory))
      return newHistory
    })
  }

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
} 