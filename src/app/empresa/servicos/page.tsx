'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ServiceForm } from '@/components/services/ServiceForm'
import { useServices } from '@/hooks/useServices'
import { Service } from '@/types/service'
import { useRouter } from 'next/navigation'

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const { services, loading, loadServices, createService, updateService, deleteService } = useServices()
  const router = useRouter()

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateService = async (data: any) => {
    await createService(data)
    setShowForm(false)
  }

  const handleUpdateService = async (data: any) => {
    if (selectedService) {
      await updateService(selectedService.id, data)
      setSelectedService(undefined)
      setShowForm(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      await deleteService(id)
    }
  }

  if (showForm || selectedService) {
    return (
      <div className="p-6">
        <ServiceForm
          service={selectedService}
          onSubmit={selectedService ? handleUpdateService : handleCreateService}
          onCancel={() => {
            setSelectedService(undefined)
            setShowForm(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          placeholder="Buscar por nome, descrição ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Carregando...</p>
        ) : filteredServices.length === 0 ? (
          <p>Nenhum serviço encontrado.</p>
        ) : (
          filteredServices.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{service.name}</span>
                  <span className="text-sm font-normal">
                    R$ {service.price.toFixed(2)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {service.description && (
                    <p className="text-sm text-gray-500">{service.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{service.duration} minutos</span>
                    {service.category && (
                      <>
                        <span>•</span>
                        <span>{service.category}</span>
                      </>
                    )}
                  </div>
                  {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {service.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/empresa/servicos/${service.id}/configuracoes`)}
                    >
                      Configurações
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedService(service)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 