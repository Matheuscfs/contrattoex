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
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Search,
  Pencil,
  Trash,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency } from '@/lib/utils'
import { EditServicoSheet } from './edit-servico-sheet'
import { DeleteServicoDialog } from './delete-servico-dialog'
import { Servico } from '@/lib/services'
import { useServicosContext } from '@/contexts/servicos-context'
import { ServicosTableSkeleton } from './servicos-table-skeleton'

export function ServicosDataTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Servico
    direction: 'asc' | 'desc'
  } | null>(null)
  const { servicos, isLoading } = useServicosContext()

  if (isLoading) {
    return <ServicosTableSkeleton />
  }

  // Função de ordenação
  const sortData = (key: keyof Servico) => {
    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
  }

  // Filtragem e ordenação dos dados
  const filteredAndSortedData = servicos
    .filter((servico) =>
      servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0
      
      const { key, direction } = sortConfig
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar serviços..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => sortData('nome')}>
                  Nome
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortData('preco')}>
                  Preço
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => sortData('duracao')}>
                  Duração (min)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((servico) => (
              <TableRow key={servico.id}>
                <TableCell className="font-medium">{servico.nome}</TableCell>
                <TableCell>{servico.categoria}</TableCell>
                <TableCell>{formatCurrency(servico.preco)}</TableCell>
                <TableCell>{servico.duracao}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    servico.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {servico.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditServicoSheet servico={servico}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </EditServicoSheet>
                      <DeleteServicoDialog servico={servico}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DeleteServicoDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 