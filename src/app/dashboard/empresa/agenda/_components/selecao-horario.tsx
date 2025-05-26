'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getHorariosDisponiveis } from '@/lib/agendamentos'
import { Skeleton } from '@/components/ui/skeleton'

interface SelecaoHorarioProps {
  empresaId: string
  data: Date
  duracaoServico: number
  onSelect: (horario: Date) => void
  horarioSelecionado?: Date
}

export function SelecaoHorario({
  empresaId,
  data,
  duracaoServico,
  onSelect,
  horarioSelecionado,
}: SelecaoHorarioProps) {
  const [horarios, setHorarios] = useState<Date[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function carregarHorarios() {
      try {
        setIsLoading(true)
        const horariosDisponiveis = await getHorariosDisponiveis(empresaId, data, duracaoServico)
        setHorarios(horariosDisponiveis)
      } catch (error) {
        console.error('Erro ao carregar horários:', error)
      } finally {
        setIsLoading(false)
      }
    }

    carregarHorarios()
  }, [empresaId, data, duracaoServico])

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9" />
          ))}
        </div>
      </div>
    )
  }

  if (horarios.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        Nenhum horário disponível nesta data
      </div>
    )
  }

  return (
    <ScrollArea className="h-[200px] pr-4">
      <div className="grid grid-cols-3 gap-2">
        {horarios.map((horario) => (
          <Button
            key={horario.toISOString()}
            variant={horarioSelecionado?.toISOString() === horario.toISOString() ? 'default' : 'outline'}
            onClick={() => onSelect(horario)}
          >
            {format(horario, 'HH:mm', { locale: ptBR })}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
} 