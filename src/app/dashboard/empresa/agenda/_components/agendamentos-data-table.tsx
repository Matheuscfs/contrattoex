'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAgendamentosContext } from '@/contexts/agendamentos-context'
import { Agendamento } from '@/lib/agendamentos'
import { AgendamentosTableSkeleton } from './agendamentos-table-skeleton'
import { EditarAgendamentoSheet } from './editar-agendamento-sheet'
import { VisualizarAgendamentoDialog } from './visualizar-agendamento-dialog'

const statusMap = {
  pendente: { label: 'Pendente', variant: 'warning', icon: Clock },
  confirmado: { label: 'Confirmado', variant: 'success', icon: CheckCircle },
  concluido: { label: 'Concluído', variant: 'success', icon: CheckCircle },
  cancelado: { label: 'Cancelado', variant: 'destructive', icon: XCircle },
} as const

interface AgendamentosDataTableProps {
  data?: Date
}

export function AgendamentosDataTable({ data }: AgendamentosDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { agendamentos, isLoading } = useAgendamentosContext()

  const agendamentosFiltrados = agendamentos
    .filter((agendamento) => {
      // Filtrar por data se fornecida
      if (data) {
        const dataAgendamento = new Date(agendamento.data_hora)
        if (dataAgendamento.toDateString() !== data.toDateString()) {
          return false
        }
      }

      // Filtrar por termo de busca
      if (searchTerm) {
        const termLower = searchTerm.toLowerCase()
        return (
          agendamento.servico.nome.toLowerCase().includes(termLower) ||
          agendamento.servico.categoria.toLowerCase().includes(termLower)
        )
      }

      return true
    })
    .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())

  if (isLoading) {
    return <AgendamentosTableSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por serviço ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Horário</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agendamentosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum agendamento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              agendamentosFiltrados.map((agendamento) => (
                <TableRow key={agendamento.id}>
                  <TableCell>
                    {format(new Date(agendamento.data_hora), 'HH:mm', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>{agendamento.servico.nome}</TableCell>
                  <TableCell>{agendamento.servico.categoria}</TableCell>
                  <TableCell>{formatCurrency(agendamento.preco)}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[agendamento.status].variant as any}>
                      {statusMap[agendamento.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <VisualizarAgendamentoDialog agendamento={agendamento}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                        </VisualizarAgendamentoDialog>
                        <EditarAgendamentoSheet agendamento={agendamento}>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" />
                            Alterar Status
                          </DropdownMenuItem>
                        </EditarAgendamentoSheet>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 