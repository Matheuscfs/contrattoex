import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function CompanySearch() {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Barra de busca */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por nome ou categoria..."
            className="pl-10"
          />
        </div>
        <Button>Buscar</Button>
      </div>

      {/* Ordenação */}
      <div className="flex justify-end">
        <Select defaultValue="relevance">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Mais relevantes</SelectItem>
            <SelectItem value="rating">Melhor avaliação</SelectItem>
            <SelectItem value="distance">Menor distância</SelectItem>
            <SelectItem value="price_low">Menor preço</SelectItem>
            <SelectItem value="price_high">Maior preço</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 