import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { SearchSuggestions } from './SearchSuggestions'
import { useSearchAnalytics } from '@/hooks/useSearchAnalytics'

export interface BaseFilterProps {
  onFilterChange: (filters: any) => void
  persistKey?: string // Chave para persistência no localStorage
  defaultFilters?: Record<string, any>
  filterConfig: {
    id: string
    type: 'text' | 'select' | 'range' | 'boolean'
    label: string
    placeholder?: string
    options?: { value: string; label: string }[]
    min?: number
    max?: number
  }[]
  searchType: 'empresa' | 'servico' | 'profissional' | 'promocao'
}

export function BaseFilter({ 
  onFilterChange, 
  persistKey,
  defaultFilters = {},
  filterConfig,
  searchType
}: BaseFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filters, setFilters] = useState(() => {
    // Tenta recuperar filtros do localStorage se houver persistKey
    if (persistKey) {
      const savedFilters = localStorage.getItem(persistKey)
      if (savedFilters) {
        return JSON.parse(savedFilters)
      }
    }
    // Caso contrário, usa os filtros padrão
    return defaultFilters
  })

  const { trackSearch } = useSearchAnalytics(searchType)

  // Atualiza a URL com os filtros
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value))
      } else {
        params.delete(key)
      }
    })

    router.push(`?${params.toString()}`, { scroll: false })

    // Persiste no localStorage se necessário
    if (persistKey) {
      localStorage.setItem(persistKey, JSON.stringify(filters))
    }

    // Registra a busca para analytics
    if (filters.search) {
      trackSearch({
        term: filters.search,
        filters: { ...filters, search: undefined },
        results: undefined // Será atualizado quando os resultados forem carregados
      })
    }
  }, [filters, persistKey, router, searchParams, trackSearch])

  const handleFilterChange = (id: string, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [id]: value }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const handleSuggestionSelect = (term: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, search: term }
      onFilterChange(newFilters)
      return newFilters
    })
    setShowSuggestions(false)
  }

  const clearFilters = () => {
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
    if (persistKey) {
      localStorage.removeItem(persistKey)
    }
  }

  return (
    <div className="w-full">
      {/* Barra de busca principal sempre visível */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar..."
            value={filters.search || ''}
            onChange={(e) => {
              handleFilterChange('search', e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Pequeno delay para permitir o clique nas sugestões
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            className="pl-9"
          />
          {showSuggestions && (
            <SearchSuggestions
              searchTerm={filters.search || ''}
              type={searchType}
              onSelect={handleSuggestionSelect}
            />
          )}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
              {Object.keys(filters).length > 1 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                  {Object.keys(filters).length - 1}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              {filterConfig.map((config) => (
                <div key={config.id} className="space-y-2">
                  <label className="text-sm font-medium">{config.label}</label>
                  {config.type === 'text' && (
                    <Input
                      placeholder={config.placeholder}
                      value={filters[config.id] || ''}
                      onChange={(e) => handleFilterChange(config.id, e.target.value)}
                    />
                  )}
                  {config.type === 'select' && config.options && (
                    <Select
                      value={filters[config.id] || 'all'}
                      onValueChange={(value) => handleFilterChange(config.id, value === 'all' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={config.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {config.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {config.type === 'range' && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        min={config.min}
                        max={config.max}
                        value={filters[`${config.id}Min`] || ''}
                        onChange={(e) => handleFilterChange(`${config.id}Min`, e.target.value)}
                      />
                      <span>até</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        min={config.min}
                        max={config.max}
                        value={filters[`${config.id}Max`] || ''}
                        onChange={(e) => handleFilterChange(`${config.id}Max`, e.target.value)}
                      />
                    </div>
                  )}
                  {config.type === 'boolean' && (
                    <Select
                      value={filters[config.id]?.toString() || 'all'}
                      onValueChange={(value) => handleFilterChange(config.id, value === 'all' ? undefined : value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={config.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={clearFilters}
              >
                Limpar Filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
} 