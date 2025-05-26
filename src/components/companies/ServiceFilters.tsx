'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { type CompanyService, type ServiceFilters as Filters } from '@/types';
import { formatCurrency } from '@/utils/format';

interface ServiceFiltersProps {
  services: CompanyService[];
  onFiltersChange: (filteredServices: CompanyService[]) => void;
}

export function ServiceFilters({ services, onFiltersChange }: ServiceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    priceRange: {
      min: Math.min(...services.map(s => s.price.value)),
      max: Math.max(...services.map(s => s.price.value))
    },
    availability: null
  });

  // Obtém todas as categorias únicas dos serviços
  const categories = Array.from(new Set(services.map(s => s.category)));

  // Encontra o menor e maior preço entre todos os serviços
  const minPrice = Math.min(...services.map(s => s.price.value));
  const maxPrice = Math.max(...services.map(s => s.price.value));

  useEffect(() => {
    const filteredServices = services.filter(service => {
      // Filtro por texto (nome ou descrição)
      const matchesSearch = filters.search === '' || 
        service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        service.description.toLowerCase().includes(filters.search.toLowerCase());

      // Filtro por categoria
      const matchesCategory = filters.category === '' || 
        service.category === filters.category;

      // Filtro por faixa de preço
      const matchesPrice = 
        service.price.value >= filters.priceRange.min &&
        service.price.value <= filters.priceRange.max;

      // Filtro por disponibilidade
      const matchesAvailability = filters.availability === null || 
        service.isAvailable === filters.availability;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });

    onFiltersChange(filteredServices);
  }, [filters, services, onFiltersChange]);

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: { min: minPrice, max: maxPrice },
      availability: null
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* Barra de pesquisa sempre visível */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar serviços..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtros</span>
          {(filters.category || filters.availability !== null || 
            filters.priceRange.min !== minPrice || filters.priceRange.max !== maxPrice) && (
            <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
              ✓
            </span>
          )}
        </button>
      </div>

      {/* Painel de filtros expansível */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as Filters['category'] }))}
                className="w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por faixa de preço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faixa de preço
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: {
                      ...prev.priceRange,
                      min: Number(e.target.value)
                    }
                  }))}
                  className="w-full"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: {
                      ...prev.priceRange,
                      max: Number(e.target.value)
                    }
                  }))}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{formatCurrency(filters.priceRange.min)}</span>
                <span>{formatCurrency(filters.priceRange.max)}</span>
              </div>
            </div>

            {/* Filtro por disponibilidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disponibilidade
              </label>
              <select
                value={filters.availability === null ? '' : filters.availability.toString()}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  availability: e.target.value === '' ? null : e.target.value === 'true'
                }))}
                className="w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Todos</option>
                <option value="true">Disponível</option>
                <option value="false">Indisponível</option>
              </select>
            </div>

            {/* Botão limpar filtros */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
                <span>Limpar filtros</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 