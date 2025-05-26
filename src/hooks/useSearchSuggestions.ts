import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchSuggestion {
  term: string
  type: 'history' | 'popular' | 'category' | 'service' | 'company'
  relevance: number
}

export function useSearchSuggestions(searchTerm: string, type: string) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    const getSuggestions = async () => {
      if (!debouncedSearch) {
        setSuggestions([])
        return
      }

      setLoading(true)

      try {
        // 1. Busca no histórico local
        const historyKey = `searchHistory_${type}`
        const savedHistory = localStorage.getItem(historyKey)
        const historyItems = savedHistory ? JSON.parse(savedHistory) : []
        
        const historySuggestions = historyItems
          .filter((item: any) => 
            item.term.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
          .map((item: any) => ({
            term: item.term,
            type: 'history',
            relevance: 3 // Histórico tem alta relevância
          }))

        // 2. Busca termos populares (simulado - em produção viria da API)
        const popularTerms = [
          'corte de cabelo',
          'manicure',
          'limpeza',
          'massagem',
          'consulta'
        ]

        const popularSuggestions = popularTerms
          .filter(term => 
            term.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
          .map(term => ({
            term,
            type: 'popular',
            relevance: 2
          }))

        // 3. Busca categorias (simulado - em produção viria da API)
        const categories = [
          'Beleza',
          'Saúde',
          'Casa',
          'Automotivo',
          'Pet'
        ]

        const categorySuggestions = categories
          .filter(category => 
            category.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
          .map(category => ({
            term: category,
            type: 'category',
            relevance: 1
          }))

        // Combina e ordena todas as sugestões
        const allSuggestions = [
          ...historySuggestions,
          ...popularSuggestions,
          ...categorySuggestions
        ].sort((a, b) => {
          // Primeiro ordena por relevância
          if (a.relevance !== b.relevance) {
            return b.relevance - a.relevance
          }
          
          // Se mesma relevância, ordena por similaridade com o termo buscado
          const aIndex = a.term.toLowerCase().indexOf(debouncedSearch.toLowerCase())
          const bIndex = b.term.toLowerCase().indexOf(debouncedSearch.toLowerCase())
          
          if (aIndex !== bIndex) {
            return aIndex - bIndex
          }
          
          // Se mesma posição do termo, ordena por tamanho
          return a.term.length - b.term.length
        })

        setSuggestions(allSuggestions.slice(0, 10)) // Limita a 10 sugestões
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    getSuggestions()
  }, [debouncedSearch, type])

  return { suggestions, loading }
} 