'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { type ServiceCategory } from '@/types';

interface ProfessionalFilters {
  search: string;
  categories: ServiceCategory[];
  rating: number | null;
  city?: string;
  state?: string;
}

interface ProfessionalFiltersProps {
  onFiltersChange: (filters: ProfessionalFilters) => void;
  initialFilters?: Partial<ProfessionalFilters>;
}

const CATEGORIES: ServiceCategory[] = [
  'residencial',
  'profissional',
  'beleza',
  'assistencia-tecnica',
  'pets'
];

export function ProfessionalFilters() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [status, setStatus] = useState('all');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar profissionais..."
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
            <SelectItem value="commission_rate">Taxa de Comissão</SelectItem>
            <SelectItem value="created_at">Data de Cadastro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 