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

interface CustomerMetric {
  total_customers: number
  new_customers: number
  returning_customers: number
  average_revenue_per_customer: number
}

export function CustomerMetrics() {
  const [metrics, setMetrics] = useState<CustomerMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true)
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('id, created_at')
          .eq('company_id', params.id)

        if (customersError) throw customersError

        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('customer_id, price')
          .eq('company_id', params.id)

        if (appointmentsError) throw appointmentsError

        if (customers && appointments) {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

          const newCustomers = customers.filter(
            (c) => new Date(c.created_at) >= thirtyDaysAgo
          )

          const customerAppointments = appointments.reduce((acc, curr) => {
            acc[curr.customer_id] = (acc[curr.customer_id] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          const returningCustomers = Object.values(customerAppointments).filter(
            (count) => count > 1
          ).length

          const totalRevenue = appointments.reduce(
            (acc, curr) => acc + (curr.price || 0),
            0
          )

          setMetrics({
            total_customers: customers.length,
            new_customers: newCustomers.length,
            returning_customers: returningCustomers,
            average_revenue_per_customer:
              totalRevenue / (customers.length || 1),
          })
        }
      } catch (error) {
        console.error('Erro ao carregar métricas de clientes:', error)
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
          <CardTitle>Métricas de Clientes</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Clientes</CardTitle>
        <CardDescription>
          Análise do comportamento dos clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total de Clientes</span>
              <span className="text-sm text-muted-foreground">
                {metrics?.total_customers || 0}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Novos Clientes (30d)</span>
              <span className="text-sm text-muted-foreground">
                {metrics?.new_customers || 0}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Clientes Recorrentes</span>
              <span className="text-sm text-muted-foreground">
                {metrics?.returning_customers || 0}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ticket Médio</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(metrics?.average_revenue_per_customer || 0)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 