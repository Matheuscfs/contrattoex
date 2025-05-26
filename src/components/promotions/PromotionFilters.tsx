"use client"

import * as React from "react"
import { Search, MapPin, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface PromotionFilters {
  search: string
  location: string
  sortBy: 'discount' | 'expiration' | 'price' | 'rating' | null
}

interface PromotionFiltersProps {
  filters: PromotionFilters
  onFiltersChange: (filters: PromotionFilters) => void
  className?: string
}

const sortOptions = [
  { value: 'discount', label: 'Maior Desconto' },
  { value: 'expiration', label: 'Termina em Breve' },
  { value: 'price', label: 'Menor Preço' },
  { value: 'rating', label: 'Melhor Avaliação' },
] as const

export function PromotionFilters({ filters, onFiltersChange, className }: PromotionFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value })
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, location: e.target.value })
  }

  const handleSortChange = (value: typeof filters.sortBy) => {
    onFiltersChange({ ...filters, sortBy: value })
  }

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === filters.sortBy)
    return option ? option.label : 'Ordenar por'
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar promoções"
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Localização */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Localização"
            value={filters.location}
            onChange={handleLocationChange}
            className="pl-10"
          />
        </div>

        {/* Ordenação */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
            >
              <span>{getSortLabel()}</span>
              <SlidersHorizontal className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tags de filtro rápido */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSortChange('discount')}
          className={filters.sortBy === 'discount' ? 'bg-primary text-white' : ''}
        >
          Maior Desconto
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSortChange('expiration')}
          className={filters.sortBy === 'expiration' ? 'bg-primary text-white' : ''}
        >
          Termina Hoje
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSortChange('price')}
          className={filters.sortBy === 'price' ? 'bg-primary text-white' : ''}
        >
          Até R$ 100
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleSortChange('rating')}
          className={filters.sortBy === 'rating' ? 'bg-primary text-white' : ''}
        >
          Melhor Avaliados
        </Button>
      </div>
    </div>
  )
} 