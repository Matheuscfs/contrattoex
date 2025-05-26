import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PromotionCard } from './PromotionCard';

// Mock data - em produção viria da API
const mockPromotions = [
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
];

export function PromotionsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Promoções em Destaque</h2>
          <Link
            href="/promocoes"
            className="text-primary font-medium hover:underline flex items-center gap-2"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPromotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              {...promotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 