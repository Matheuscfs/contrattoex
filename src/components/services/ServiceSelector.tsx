'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useServices } from '@/hooks/useServices'
import { Service } from '@/types/service'

interface ServiceSelectorProps {
  selectedServices: string[]
  onSelect: (services: string[]) => void
  excludeServiceId?: string
}

export function ServiceSelector({ selectedServices, onSelect, excludeServiceId }: ServiceSelectorProps) {
  const { services, loadServices } = useServices()
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices().then(() => setLoading(false))
  }, [loadServices])

  const filteredServices = services
    .filter(service => 
      service.id !== excludeServiceId && (
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

  const handleToggleService = (serviceId: string) => {
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId]
    onSelect(newSelection)
  }

  if (loading) {
    return <div>Carregando serviços...</div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search-services">Buscar Serviços</Label>
        <Input
          id="search-services"
          placeholder="Digite para buscar serviços..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-colors ${
              selectedServices.includes(service.id)
                ? 'border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => handleToggleService(service.id)}
          >
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <h4 className="font-medium">{service.name}</h4>
                {service.description && (
                  <p className="text-sm text-gray-500">{service.description}</p>
                )}
                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                  <span>R$ {service.price.toFixed(2)}</span>
                  <span>•</span>
                  <span>{service.duration} minutos</span>
                </div>
              </div>
              {selectedServices.includes(service.id) && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 