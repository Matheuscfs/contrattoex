'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'

const BUSINESS_TYPES = [
  'Todos',
  'Salão de Beleza',
  'Barbearia',
  'Estética',
  'Pet Shop',
  'Oficina Mecânica',
  'Consultório Médico',
  'Consultório Odontológico',
  'Outros'
]

interface CompanyFiltersProps {
  onFilterChange: (filters: {
    businessType: string
    location: string
    priceRange: {
      min: number
      max: number
    }
  }) => void
}

export function CompanyFilters({ onFilterChange }: CompanyFiltersProps) {
  const [businessType, setBusinessType] = useState('Todos')
  const [location, setLocation] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  const handleFilterChange = () => {
    onFilterChange({
      businessType,
      location,
      priceRange
    })
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="business-type">Tipo de Negócio</Label>
          <Select
            value={businessType}
            onValueChange={(value) => {
              setBusinessType(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de negócio" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            placeholder="Digite a cidade ou bairro"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              handleFilterChange()
            }}
          />
        </div>

        <div>
          <Label>Faixa de Preço</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                placeholder="Mínimo"
                value={priceRange.min}
                onChange={(e) => {
                  setPriceRange({ ...priceRange, min: Number(e.target.value) })
                  handleFilterChange()
                }}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Máximo"
                value={priceRange.max}
                onChange={(e) => {
                  setPriceRange({ ...priceRange, max: Number(e.target.value) })
                  handleFilterChange()
                }}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleFilterChange} className="w-full">
          Aplicar Filtros
        </Button>
      </div>
    </Card>
  )
} 