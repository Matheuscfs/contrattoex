'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Star, Filter, X } from 'lucide-react';

interface FilterState {
  search: string;
  location: string;
  category: string;
  minRating: number;
  maxPrice: number;
  availability: string;
  specialties: string[];
}

interface ProfessionalFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const categories = [
  { value: 'servicos-gerais', label: 'Serviços Gerais' },
  { value: 'beleza', label: 'Beleza & Bem-estar' },
  { value: 'saude', label: 'Saúde & Terapias' },
  { value: 'construcao', label: 'Construção & Reforma' },
  { value: 'limpeza', label: 'Limpeza & Conservação' },
];

const specialties = [
  'Eletricista', 'Encanador', 'Diarista', 'Pintor', 'Pedreiro',
  'Cabeleireiro', 'Barbeiro', 'Esteticista', 'Manicure',
  'Fisioterapeuta', 'Personal Trainer', 'Massagista',
  'Técnico em TI', 'Desenvolvedor', 'Designer'
];

const availabilityOptions = [
  { value: 'disponivel', label: 'Disponível agora' },
  { value: 'hoje', label: 'Disponível hoje' },
  { value: 'semana', label: 'Disponível esta semana' },
  { value: 'mes', label: 'Disponível este mês' },
];

export function ProfessionalFilters({ filters, onFiltersChange, onClearFilters }: ProfessionalFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addSpecialty = (specialty: string) => {
    if (!filters.specialties.includes(specialty)) {
      updateFilter('specialties', [...filters.specialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: string) => {
    updateFilter('specialties', filters.specialties.filter(s => s !== specialty));
  };

  const hasActiveFilters = filters.search || filters.location || filters.category || 
    filters.minRating > 0 || filters.maxPrice < 1000 || filters.availability || 
    filters.specialties.length > 0;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Menos filtros' : 'Mais filtros'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filtros básicos - sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar profissional</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Nome ou especialidade..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="location"
                placeholder="Cidade ou bairro..."
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros avançados - expansíveis */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avaliação mínima */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Avaliação mínima: {filters.minRating} estrelas
                </Label>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={(value) => updateFilter('minRating', value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>5 estrelas</span>
                </div>
              </div>

              {/* Preço máximo */}
              <div className="space-y-3">
                <Label>
                  Preço máximo: R$ {filters.maxPrice === 1000 ? '1000+' : filters.maxPrice}
                </Label>
                <Slider
                  value={[filters.maxPrice]}
                  onValueChange={(value) => updateFilter('maxPrice', value[0])}
                  max={1000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>R$ 0</span>
                  <span>R$ 1000+</span>
                </div>
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="space-y-2">
              <Label>Disponibilidade</Label>
              <Select value={filters.availability || 'all'} onValueChange={(value) => updateFilter('availability', value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Qualquer disponibilidade</SelectItem>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Especialidades */}
            <div className="space-y-3">
              <Label>Especialidades</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {specialties.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={filters.specialties.includes(specialty) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      filters.specialties.includes(specialty) 
                        ? removeSpecialty(specialty)
                        : addSpecialty(specialty)
                    }
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
              
              {filters.specialties.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Especialidades selecionadas:</Label>
                  <div className="flex flex-wrap gap-2">
                    {filters.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                        {specialty}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeSpecialty(specialty)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 