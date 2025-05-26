'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ServiceSelector } from '@/components/services/ServiceSelector'
import { useServices } from '@/hooks/useServices'
import { Service, ServiceVariation, PackageOption, TimeDiscountRule, QuantityDiscountRule } from '@/types/service'

export default function ServiceConfigPage() {
  const params = useParams()
  const router = useRouter()
  const { services, loadServices, updateService } = useServices()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  // Estado para novas variações e pacotes
  const [newVariation, setNewVariation] = useState<Partial<ServiceVariation>>({})
  const [newPackage, setNewPackage] = useState<Partial<PackageOption>>({})

  useEffect(() => {
    if (params.id) {
      loadServices().then(() => {
        const foundService = services.find(s => s.id === params.id)
        if (foundService) {
          setService(foundService)
        } else {
          toast.error('Serviço não encontrado')
          router.push('/empresa/servicos')
        }
        setLoading(false)
      })
    }
  }, [params.id, loadServices, services, router])

  const handleAddVariation = () => {
    if (!service) return

    if (!newVariation.name || !newVariation.price || !newVariation.duration) {
      toast.error('Preencha todos os campos da variação')
      return
    }

    const variation: ServiceVariation = {
      id: Math.random().toString(36).substr(2, 9),
      name: newVariation.name,
      price: Number(newVariation.price),
      duration: Number(newVariation.duration),
      description: newVariation.description,
    }

    const updatedService = {
      ...service,
      variations: [...(service.variations || []), variation],
    }

    updateService(service.id, updatedService)
      .then(() => {
        setService(updatedService)
        setNewVariation({})
        toast.success('Variação adicionada com sucesso')
      })
  }

  const handleRemoveVariation = (variationId: string) => {
    if (!service) return

    const updatedService = {
      ...service,
      variations: service.variations?.filter(v => v.id !== variationId) || [],
    }

    updateService(service.id, updatedService)
      .then(() => {
        setService(updatedService)
        toast.success('Variação removida com sucesso')
      })
  }

  const handleAddPackage = () => {
    if (!service) return

    if (!newPackage.name || !newPackage.price || !newPackage.services?.length) {
      toast.error('Preencha todos os campos do pacote')
      return
    }

    const packageOption: PackageOption = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPackage.name,
      services: newPackage.services || [],
      price: Number(newPackage.price),
      discount: Number(newPackage.discount || 0),
      description: newPackage.description,
    }

    const updatedService = {
      ...service,
      package_options: [...(service.package_options || []), packageOption],
    }

    updateService(service.id, updatedService)
      .then(() => {
        setService(updatedService)
        setNewPackage({})
        toast.success('Pacote adicionado com sucesso')
      })
  }

  const handleRemovePackage = (packageId: string) => {
    if (!service) return

    const updatedService = {
      ...service,
      package_options: service.package_options?.filter(p => p.id !== packageId) || [],
    }

    updateService(service.id, updatedService)
      .then(() => {
        setService(updatedService)
        toast.success('Pacote removido com sucesso')
      })
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  if (!service) {
    return <div className="p-6">Serviço não encontrado</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações do Serviço</h1>
        <Button variant="outline" onClick={() => router.push('/empresa/servicos')}>
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variações do Serviço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="variation-name">Nome da Variação</Label>
              <Input
                id="variation-name"
                value={newVariation.name || ''}
                onChange={(e) => setNewVariation({ ...newVariation, name: e.target.value })}
                placeholder="Ex: Premium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variation-price">Preço (R$)</Label>
              <Input
                id="variation-price"
                type="number"
                step="0.01"
                min="0"
                value={newVariation.price || ''}
                onChange={(e) => setNewVariation({ ...newVariation, price: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variation-duration">Duração (minutos)</Label>
              <Input
                id="variation-duration"
                type="number"
                min="1"
                value={newVariation.duration || ''}
                onChange={(e) => setNewVariation({ ...newVariation, duration: Number(e.target.value) })}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variation-description">Descrição</Label>
              <Textarea
                id="variation-description"
                value={newVariation.description || ''}
                onChange={(e) => setNewVariation({ ...newVariation, description: e.target.value })}
                placeholder="Descreva os detalhes desta variação"
              />
            </div>
          </div>
          <Button onClick={handleAddVariation}>Adicionar Variação</Button>

          {service.variations && service.variations.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Variações Existentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.variations.map((variation) => (
                  <Card key={variation.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{variation.name}</h4>
                          <p className="text-sm text-gray-500">{variation.description}</p>
                          <div className="flex gap-2 text-sm text-gray-500 mt-1">
                            <span>R$ {variation.price.toFixed(2)}</span>
                            <span>•</span>
                            <span>{variation.duration} minutos</span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveVariation(variation.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pacotes de Serviços</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="package-name">Nome do Pacote</Label>
              <Input
                id="package-name"
                value={newPackage.name || ''}
                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                placeholder="Ex: Pacote Completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="package-price">Preço (R$)</Label>
              <Input
                id="package-price"
                type="number"
                step="0.01"
                min="0"
                value={newPackage.price || ''}
                onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="package-discount">Desconto (%)</Label>
              <Input
                id="package-discount"
                type="number"
                min="0"
                max="100"
                value={newPackage.discount || ''}
                onChange={(e) => setNewPackage({ ...newPackage, discount: Number(e.target.value) })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="package-description">Descrição</Label>
              <Textarea
                id="package-description"
                value={newPackage.description || ''}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                placeholder="Descreva os detalhes deste pacote"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Serviços Inclusos</Label>
            <ServiceSelector
              selectedServices={newPackage.services || []}
              onSelect={(services) => setNewPackage({ ...newPackage, services })}
              excludeServiceId={service.id}
            />
          </div>

          <Button onClick={handleAddPackage}>Adicionar Pacote</Button>

          {service.package_options && service.package_options.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Pacotes Existentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.package_options.map((packageOption) => {
                  const includedServices = services.filter(s => 
                    packageOption.services.includes(s.id)
                  )
                  
                  return (
                    <Card key={packageOption.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h4 className="font-medium">{packageOption.name}</h4>
                            <p className="text-sm text-gray-500">{packageOption.description}</p>
                            <div className="flex gap-2 text-sm text-gray-500">
                              <span>R$ {packageOption.price.toFixed(2)}</span>
                              {packageOption.discount > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{packageOption.discount}% de desconto</span>
                                </>
                              )}
                            </div>
                            {includedServices.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Serviços Inclusos:</p>
                                <ul className="text-sm text-gray-500 list-disc list-inside">
                                  {includedServices.map(service => (
                                    <li key={service.id}>{service.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemovePackage(packageOption.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regras de Desconto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time-discount">Desconto por Horário</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-time" className="text-sm">Início</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={service.discount_rules?.time?.startTime || ''}
                    onChange={(e) => {
                      const timeRule: TimeDiscountRule = {
                        type: 'time',
                        value: service.discount_rules?.time?.value || 0,
                        startTime: e.target.value,
                        endTime: service.discount_rules?.time?.endTime || '',
                      }
                      const updatedService = {
                        ...service,
                        discount_rules: {
                          ...service.discount_rules,
                          time: timeRule,
                        },
                      }
                      updateService(service.id, updatedService)
                        .then(() => setService(updatedService))
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="end-time" className="text-sm">Fim</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={service.discount_rules?.time?.endTime || ''}
                    onChange={(e) => {
                      const timeRule: TimeDiscountRule = {
                        type: 'time',
                        value: service.discount_rules?.time?.value || 0,
                        startTime: service.discount_rules?.time?.startTime || '',
                        endTime: e.target.value,
                      }
                      const updatedService = {
                        ...service,
                        discount_rules: {
                          ...service.discount_rules,
                          time: timeRule,
                        },
                      }
                      updateService(service.id, updatedService)
                        .then(() => setService(updatedService))
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="% de desconto"
                  className="w-32"
                  value={service.discount_rules?.time?.value || ''}
                  onChange={(e) => {
                    const timeRule: TimeDiscountRule = {
                      type: 'time',
                      value: Number(e.target.value),
                      startTime: service.discount_rules?.time?.startTime || '',
                      endTime: service.discount_rules?.time?.endTime || '',
                    }
                    const updatedService = {
                      ...service,
                      discount_rules: {
                        ...service.discount_rules,
                        time: timeRule,
                      },
                    }
                    updateService(service.id, updatedService)
                      .then(() => setService(updatedService))
                  }}
                />
                <span className="text-sm text-gray-500">% de desconto</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity-discount">Desconto por Quantidade</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-quantity" className="text-sm">Mínimo</Label>
                  <Input
                    id="min-quantity"
                    type="number"
                    min="1"
                    value={service.discount_rules?.quantity?.minQuantity || ''}
                    onChange={(e) => {
                      const quantityRule: QuantityDiscountRule = {
                        type: 'quantity',
                        value: service.discount_rules?.quantity?.value || 0,
                        minQuantity: Number(e.target.value),
                        maxQuantity: service.discount_rules?.quantity?.maxQuantity || 1,
                      }
                      const updatedService = {
                        ...service,
                        discount_rules: {
                          ...service.discount_rules,
                          quantity: quantityRule,
                        },
                      }
                      updateService(service.id, updatedService)
                        .then(() => setService(updatedService))
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="max-quantity" className="text-sm">Máximo</Label>
                  <Input
                    id="max-quantity"
                    type="number"
                    min="1"
                    value={service.discount_rules?.quantity?.maxQuantity || ''}
                    onChange={(e) => {
                      const quantityRule: QuantityDiscountRule = {
                        type: 'quantity',
                        value: service.discount_rules?.quantity?.value || 0,
                        minQuantity: service.discount_rules?.quantity?.minQuantity || 1,
                        maxQuantity: Number(e.target.value),
                      }
                      const updatedService = {
                        ...service,
                        discount_rules: {
                          ...service.discount_rules,
                          quantity: quantityRule,
                        },
                      }
                      updateService(service.id, updatedService)
                        .then(() => setService(updatedService))
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="% de desconto"
                  className="w-32"
                  value={service.discount_rules?.quantity?.value || ''}
                  onChange={(e) => {
                    const quantityRule: QuantityDiscountRule = {
                      type: 'quantity',
                      value: Number(e.target.value),
                      minQuantity: service.discount_rules?.quantity?.minQuantity || 1,
                      maxQuantity: service.discount_rules?.quantity?.maxQuantity || 1,
                    }
                    const updatedService = {
                      ...service,
                      discount_rules: {
                        ...service.discount_rules,
                        quantity: quantityRule,
                      },
                    }
                    updateService(service.id, updatedService)
                      .then(() => setService(updatedService))
                  }}
                />
                <span className="text-sm text-gray-500">% de desconto</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 