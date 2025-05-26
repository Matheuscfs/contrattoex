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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DailyRevenue {
  date: string
  revenue: number
}

export function RevenueChart() {
  const [data, setData] = useState<DailyRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('daily_metrics')
          .select('date, total_revenue')
          .eq('company_id', params.id)
          .order('date', { ascending: true })
          .limit(30)

        if (error) throw error

        if (data) {
          const formattedData = data.map((item) => ({
            date: new Date(item.date).toLocaleDateString('pt-BR'),
            revenue: item.total_revenue,
          }))

          setData(formattedData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados de receita:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id, supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Receita Diária</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Diária</CardTitle>
        <CardDescription>
          Evolução da receita nos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => [
                  formatCurrency(value),
                  'Receita',
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 