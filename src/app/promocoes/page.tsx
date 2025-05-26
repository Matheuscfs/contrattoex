"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { PromotionCard } from "@/components/promotions/PromotionCard"
import { PromotionFilters, type PromotionFilters as Filters } from "@/components/promotions/PromotionFilters"

// Mock data - em produção viria da API
const allPromotions = [
  {
    id: '1',
    title: 'Pintura Residencial com 30% de Desconto',
    description: 'Renove o visual da sua casa com nosso serviço profissional de pintura. Inclui material e mão de obra.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    originalPrice: 2500,
    discountedPrice: 1750,
    discountPercentage: 30,
    provider: {
      name: 'Pinturas Profissionais',
      rating: 4.8,
      location: 'São Paulo, SP',
    },
    validUntil: '2024-04-30',
  },
  {
    id: '2',
    title: 'Manutenção de Ar Condicionado',
    description: 'Limpeza completa e higienização do seu ar condicionado. Aproveite o desconto da semana!',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500',
    originalPrice: 350,
    discountedPrice: 245,
    discountPercentage: 30,
    provider: {
      name: 'Clima Perfeito',
      rating: 4.9,
      location: 'Rio de Janeiro, RJ',
    },
    validUntil: '2024-04-25',
  },
  {
    id: '3',
    title: 'Instalação de Piso Laminado',
    description: 'Instalação profissional de piso laminado com material incluso. Transforme seu ambiente!',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=500',
    originalPrice: 3000,
    discountedPrice: 2250,
    discountPercentage: 25,
    provider: {
      name: 'Pisos & Acabamentos',
      rating: 4.7,
      location: 'Curitiba, PR',
    },
    validUntil: '2024-04-28',
  },
  {
    id: '4',
    title: 'Limpeza de Sofá Profissional',
    description: 'Higienização completa do seu sofá com produtos especializados e remoção de manchas.',
    image: 'https://images.unsplash.com/photo-1669392907654-4e766e286a38?w=500',
    originalPrice: 400,
    discountedPrice: 280,
    discountPercentage: 30,
    provider: {
      name: 'Clean House',
      rating: 4.6,
      location: 'São Paulo, SP',
    },
    validUntil: '2024-04-22',
  },
  {
    id: '5',
    title: 'Instalação Elétrica Residencial',
    description: 'Serviços elétricos com profissionais certificados. Instalação, manutenção e reparos.',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500',
    originalPrice: 800,
    discountedPrice: 600,
    discountPercentage: 25,
    provider: {
      name: 'Eletrotec',
      rating: 4.9,
      location: 'Belo Horizonte, MG',
    },
    validUntil: '2024-04-29',
  },
  {
    id: '6',
    title: 'Jardinagem Completa',
    description: 'Serviço completo de jardinagem: poda, plantio, adubação e manutenção.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500',
    originalPrice: 450,
    discountedPrice: 315,
    discountPercentage: 30,
    provider: {
      name: 'Jardins & Cia',
      rating: 4.8,
      location: 'Florianópolis, SC',
    },
    validUntil: '2024-04-26',
  },
];

export default function PromocoesPage() {
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    location: '',
    sortBy: null,
  })

  const filteredPromotions = React.useMemo(() => {
    let filtered = [...allPromotions]

    // Filtrar por texto de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        promo => 
          promo.title.toLowerCase().includes(searchLower) ||
          promo.description.toLowerCase().includes(searchLower) ||
          promo.provider.name.toLowerCase().includes(searchLower)
      )
    }

    // Filtrar por localização
    if (filters.location) {
      const locationLower = filters.location.toLowerCase()
      filtered = filtered.filter(
        promo => promo.provider.location.toLowerCase().includes(locationLower)
      )
    }

    // Ordenar resultados
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'discount':
          filtered.sort((a, b) => b.discountPercentage - a.discountPercentage)
          break
        case 'expiration':
          filtered.sort((a, b) => new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime())
          break
        case 'price':
          filtered.sort((a, b) => a.discountedPrice - b.discountedPrice)
          break
        case 'rating':
          filtered.sort((a, b) => b.provider.rating - a.provider.rating)
          break
      }
    }

    return filtered
  }, [filters])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Promoções</h1>
          <p className="text-lg text-gray-600">
            Encontre as melhores ofertas de serviços na sua região
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <PromotionFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Lista de Promoções */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              {...promotion}
            />
          ))}
        </div>

        {/* Paginação */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Próxima</Button>
          </div>
        </div>
      </div>
    </main>
  )
} 