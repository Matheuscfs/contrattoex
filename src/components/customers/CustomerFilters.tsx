'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

export function CustomerFilters() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="total_appointments">Total de Agendamentos</SelectItem>
            <SelectItem value="total_spent">Total Gasto</SelectItem>
            <SelectItem value="last_visit">Última Visita</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 