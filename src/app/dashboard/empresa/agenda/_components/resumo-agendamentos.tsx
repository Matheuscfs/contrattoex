'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAgendamentosContext } from '@/contexts/agendamentos-context'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface ResumoAgendamentosProps {
  data?: Date
}

interface ResumoData {
  totalAgendamentos: number
  totalConfirmados: number
  totalPendentes: number
  faturamentoPrevisto: number
  taxaOcupacao: number
}

export function ResumoAgendamentos({ data }: ResumoAgendamentosProps) {
  const [resumo, setResumo] = useState<ResumoData>({
    totalAgendamentos: 0,
    totalConfirmados: 0,
    totalPendentes: 0,
    faturamentoPrevisto: 0,
    taxaOcupacao: 0,
  })
  const { agendamentos, isLoading } = useAgendamentosContext()

  useEffect(() => {
    if (!data || isLoading) return

    const agendamentosDoDia = agendamentos.filter(
      (agendamento) => new Date(agendamento.data_hora).toDateString() === data.toDateString()
    )

    const confirmados = agendamentosDoDia.filter(
      (agendamento) => agendamento.status === 'confirmado'
    )

    const pendentes = agendamentosDoDia.filter(
      (agendamento) => agendamento.status === 'pendente'
    )

    const faturamento = agendamentosDoDia.reduce(
      (total, agendamento) => total + agendamento.preco,
      0
    )

    // Considerando horário comercial de 8h às 18h = 600 minutos
    const minutosTotais = 600
    const minutosOcupados = agendamentosDoDia.reduce(
      (total, agendamento) => total + agendamento.duracao,
      0
    )
    const taxaOcupacao = (minutosOcupados / minutosTotais) * 100

    setResumo({
      totalAgendamentos: agendamentosDoDia.length,
      totalConfirmados: confirmados.length,
      totalPendentes: pendentes.length,
      faturamentoPrevisto: faturamento,
      taxaOcupacao,
    })
  }, [data, agendamentos, isLoading])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Resumo do Dia</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total de Agendamentos</span>
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Confirmados</span>
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Pendentes</span>
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Faturamento Previsto</span>
            <Skeleton className="h-4 w-[80px]" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Taxa de Ocupação</span>
            <Skeleton className="h-4 w-[60px]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg">Resumo do Dia</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total de Agendamentos</span>
          <span className="font-medium">{resumo.totalAgendamentos}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Confirmados</span>
          <span className="font-medium text-green-600">{resumo.totalConfirmados}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Pendentes</span>
          <span className="font-medium text-yellow-600">{resumo.totalPendentes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Faturamento Previsto</span>
          <span className="font-medium">{formatCurrency(resumo.faturamentoPrevisto)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Taxa de Ocupação</span>
          <span className="font-medium">{resumo.taxaOcupacao.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  )
} 