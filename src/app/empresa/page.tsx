'use client'

import * as React from "react";
import { CompanyLayout } from "@/components/layouts/CompanyLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/charts/BarChart";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface DashboardData {
  totalServices: number
  totalAppointments: number
  totalRevenue: number
  revenueByMonth: {
    labels: string[]
    data: number[]
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalServices: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    revenueByMonth: {
      labels: [],
      data: []
    }
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Carregar serviços
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user?.id)

      if (servicesError) throw servicesError

      // Dados mockados para exemplo
      // TODO: Implementar integração real com a API
      const mockData: DashboardData = {
        totalServices: services?.length || 0,
        totalAppointments: 48,
        totalRevenue: 4800,
        revenueByMonth: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          data: [500, 800, 1200, 900, 1500, 800]
        }
      }

      setData(mockData)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = {
    labels: data.revenueByMonth.labels,
    datasets: [
      {
        label: 'Receita Mensal',
        data: data.revenueByMonth.data,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      }
    ]
  }

  if (loading) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe os principais indicadores do seu negócio
          </p>
        </div>

        <Tabs defaultValue="hoje" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="semana">Esta Semana</TabsTrigger>
          </TabsList>

          <TabsContent value="hoje" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalServices}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agendamentos do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalAppointments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Receita Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {data.totalRevenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="semana" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agendamentos
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.totalAppointments}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8% em relação à semana anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Faturamento
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {data.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação à semana anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Novos Clientes
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.totalServices}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +3 em relação à semana anterior
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart data={chartData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CompanyLayout>
  );
} 