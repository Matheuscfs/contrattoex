import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react'

export default async function EmpresaDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 em relação a ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+8 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.250</div>
            <p className="text-xs text-muted-foreground">+12% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-xs text-muted-foreground">+2% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Agendamentos do Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Lista de Agendamentos */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">João Silva</p>
                  <p className="text-sm text-muted-foreground">Corte de Cabelo</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">14:30</p>
                  <p className="text-sm text-muted-foreground">45min</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-sm text-muted-foreground">Manicure</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">15:30</p>
                  <p className="text-sm text-muted-foreground">60min</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 