'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

interface ServiceMetric {
  service_name: string
  total_appointments: number
  total_revenue: number
  average_rating: number
}

export function ServiceMetrics() {
  const [metrics, setMetrics] = useState<ServiceMetric[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true)
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('id, name')
          .eq('company_id', params.id)

        if (servicesError) throw servicesError

        const { data: metrics, error: metricsError } = await supabase
          .from('service_metrics')
          .select('*')
          .eq('company_id', params.id)
          .order('date', { ascending: false })
          .limit(30)

        if (metricsError) throw metricsError

        if (services && metrics) {
          const serviceMetrics = services.map((service) => {
            const serviceData = metrics.filter((m) => m.service_id === service.id)
            return {
              service_name: service.name,
              total_appointments: serviceData.reduce(
                (acc, curr) => acc + curr.total_appointments,
                0
              ),
              total_revenue: serviceData.reduce(
                (acc, curr) => acc + curr.total_revenue,
                0
              ),
              average_rating:
                serviceData.reduce(
                  (acc, curr) => acc + curr.average_rating,
                  0
                ) / (serviceData.length || 1),
            }
          })

          setMetrics(serviceMetrics)
        }
      } catch (error) {
        console.error('Erro ao carregar métricas por serviço:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [params.id, supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas por Serviço</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas por Serviço</CardTitle>
        <CardDescription>
          Desempenho dos últimos 30 dias por serviço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {metrics.map((metric) => (
            <div key={metric.service_name} className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.service_name}</span>
                <span className="text-sm text-muted-foreground">
                  {metric.total_appointments} agendamentos
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatCurrency(metric.total_revenue)}
                </span>
                <span className="text-muted-foreground">
                  {metric.average_rating.toFixed(1)} ★
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 