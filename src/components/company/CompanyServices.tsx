"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Company } from '@/types/company'

interface CompanyServicesProps {
  company: Company
}

export function CompanyServices({ company }: CompanyServicesProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Agrupar serviços por categoria
  const servicesByCategory = company.services.reduce((acc, service) => {
    const category = service.category || 'Outros'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(service)
    return acc
  }, {} as Record<string, typeof company.services>)

  // Filtrar serviços
  const filteredCategories = Object.entries(servicesByCategory).reduce((acc, [category, services]) => {
    const filteredServices = services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filteredServices.length > 0) {
      acc[category] = filteredServices
    }
    return acc
  }, {} as Record<string, typeof company.services>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar serviços..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={Object.keys(filteredCategories)[0]} className="w-full">
          <TabsList className="w-full justify-start">
            {Object.keys(filteredCategories).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(filteredCategories).map(([category, services]) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      )}
                      <div className="text-sm text-gray-600 mt-2">
                        Duração: {service.duration} minutos
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        R$ {service.price.toFixed(2)}
                      </div>
                      <Button size="sm" className="mt-2">
                        Agendar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
} 