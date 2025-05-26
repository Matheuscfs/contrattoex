import { useEffect } from 'react'

interface SearchAnalyticsData {
  term: string
  type: string
  timestamp: number
  filters?: Record<string, any>
  results?: number
  conversionType?: 'view' | 'click' | 'book'
}

const MAX_ANALYTICS_ITEMS = 1000

export function useSearchAnalytics(type: string) {
  const trackSearch = (data: Omit<SearchAnalyticsData, 'type' | 'timestamp'>) => {
    try {
      // 1. Recupera dados existentes
      const analyticsKey = `searchAnalytics_${type}`
      const savedAnalytics = localStorage.getItem(analyticsKey)
      const analytics = savedAnalytics ? JSON.parse(savedAnalytics) : []

      // 2. Adiciona novo registro
      const newAnalytics = [
        {
          ...data,
          type,
          timestamp: Date.now()
        },
        ...analytics
      ].slice(0, MAX_ANALYTICS_ITEMS) // Mantém apenas os últimos N registros

      // 3. Salva no localStorage
      localStorage.setItem(analyticsKey, JSON.stringify(newAnalytics))

      // 4. Em produção, enviaria para um serviço de analytics
      if (process.env.NODE_ENV === 'production') {
        // TODO: Enviar para serviço de analytics
        console.log('Search analytics:', {
          ...data,
          type,
          timestamp: Date.now()
        })
      }
    } catch (error) {
      console.error('Erro ao salvar analytics:', error)
    }
  }

  const getAnalytics = (): SearchAnalyticsData[] => {
    try {
      const analyticsKey = `searchAnalytics_${type}`
      const savedAnalytics = localStorage.getItem(analyticsKey)
      return savedAnalytics ? JSON.parse(savedAnalytics) : []
    } catch (error) {
      console.error('Erro ao recuperar analytics:', error)
      return []
    }
  }

  const getPopularTerms = (limit = 10): { term: string; count: number }[] => {
    const analytics = getAnalytics()
    
    // Agrupa por termo e conta ocorrências
    const termCounts = analytics.reduce((acc: Record<string, number>, item: SearchAnalyticsData) => {
      acc[item.term] = (acc[item.term] || 0) + 1
      return acc
    }, {})

    // Converte para array e ordena
    return Object.entries(termCounts)
      .map(([term, count]) => ({ term, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  const getConversionRate = (conversionType: SearchAnalyticsData['conversionType']) => {
    const analytics = getAnalytics()
    
    if (analytics.length === 0) return 0

    const conversions = analytics.filter(
      (item: SearchAnalyticsData) => item.conversionType === conversionType
    ).length

    return (conversions / analytics.length) * 100
  }

  const getAverageTimeToConversion = () => {
    const analytics = getAnalytics()
    const conversions = analytics.filter((item: SearchAnalyticsData) => item.conversionType)

    if (conversions.length === 0) return 0

    const totalTime = conversions.reduce((acc: number, curr: SearchAnalyticsData, index: number) => {
      if (index === 0) return 0
      return acc + (curr.timestamp - conversions[index - 1].timestamp)
    }, 0)

    return totalTime / conversions.length
  }

  const getMostUsedFilters = (limit = 10): { filter: string; count: number }[] => {
    const analytics = getAnalytics()
    const filterCounts: Record<string, number> = {}

    // Conta uso de cada filtro
    analytics.forEach((item: SearchAnalyticsData) => {
      if (item.filters) {
        Object.keys(item.filters).forEach(filter => {
          filterCounts[filter] = (filterCounts[filter] || 0) + 1
        })
      }
    })

    // Converte para array e ordena
    return Object.entries(filterCounts)
      .map(([filter, count]) => ({ filter, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  return {
    trackSearch,
    getAnalytics,
    getPopularTerms,
    getConversionRate,
    getAverageTimeToConversion,
    getMostUsedFilters
  }
} 