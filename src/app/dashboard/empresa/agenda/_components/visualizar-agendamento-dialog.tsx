'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Agendamento } from '@/lib/agendamentos'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
import { EditarAgendamentoSheet } from './editar-agendamento-sheet'
import { Pencil } from 'lucide-react'

interface VisualizarAgendamentoDialogProps {
  agendamento: Agendamento
  children: React.ReactNode
}

const statusMap = {
  pendente: { label: 'Pendente', variant: 'warning' },
  confirmado: { label: 'Confirmado', variant: 'success' },
  concluido: { label: 'Concluído', variant: 'success' },
  cancelado: { label: 'Cancelado', variant: 'destructive' },
} as const

export function VisualizarAgendamentoDialog({
  agendamento,
  children,
}: VisualizarAgendamentoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <EditarAgendamentoSheet agendamento={agendamento}>
              <Button size="icon" variant="ghost">
                <Pencil className="h-4 w-4" />
              </Button>
            </EditarAgendamentoSheet>
          </div>
          <DialogDescription>
            {format(new Date(agendamento.data_hora), "dd 'de' MMMM 'às' HH:mm", {
              locale: ptBR,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Status</span>
            <div className="col-span-3">
              <Badge variant={statusMap[agendamento.status].variant as any}>
                {statusMap[agendamento.status].label}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Serviço</span>
            <span className="col-span-3">{agendamento.servico.nome}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Categoria</span>
            <span className="col-span-3">{agendamento.servico.categoria}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Duração</span>
            <span className="col-span-3">{agendamento.duracao} minutos</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Preço</span>
            <span className="col-span-3">{formatCurrency(agendamento.preco)}</span>
          </div>
          {agendamento.observacoes && (
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-sm font-medium">Observações</span>
              <span className="col-span-3">{agendamento.observacoes}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 