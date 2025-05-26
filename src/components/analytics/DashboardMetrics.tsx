'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

interface DashboardMetric {
  total_appointments: number
  total_revenue: number
  new_customers: number
  average_rating: number
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('daily_metrics')
          .select('*')
          .eq('company_id', params.id)
          .order('date', { ascending: false })
          .limit(30)

        if (error) throw error

        if (data && data.length > 0) {
          const aggregatedMetrics = data.reduce(
            (acc, curr) => ({
              total_appointments: acc.total_appointments + curr.total_appointments,
              total_revenue: acc.total_revenue + curr.total_revenue,
              new_customers: acc.new_customers + curr.new_customers,
              average_rating:
                acc.average_rating > 0
                  ? (acc.average_rating + curr.average_rating) / 2
                  : curr.average_rating,
            }),
            {
              total_appointments: 0,
              total_revenue: 0,
              new_customers: 0,
              average_rating: 0,
            }
          )

          setMetrics(aggregatedMetrics)
        }
      } catch (error) {
        console.error('Erro ao carregar métricas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.total_appointments || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Últimos 30 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Faturamento Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics?.total_revenue || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Últimos 30 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Novos Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.new_customers || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Últimos 30 dias
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avaliação Média
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.average_rating.toFixed(1) || '0.0'}
          </div>
          <p className="text-xs text-muted-foreground">
            Últimos 30 dias
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 