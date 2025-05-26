import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  ArrowLeft,
  Share2
} from "lucide-react";

// Mock data - em produção viria da API
const promotions = [
  {
    id: '1',
    title: 'Pintura Residencial com 30% de Desconto',
    description: 'Renove o visual da sua casa com nosso serviço profissional de pintura. Inclui material e mão de obra.',
    fullDescription: `
      Aproveite esta oferta especial para renovar sua casa com nosso serviço profissional de pintura.

      O que está incluído:
      - Avaliação inicial e orçamento detalhado
      - Preparação completa das superfícies
      - Pintura de paredes internas e/ou externas
      - Material de primeira qualidade
      - Equipe especializada e experiente
      - Limpeza pós-serviço
      
      Condições:
      - Válido para ambientes residenciais
      - Área mínima de 50m²
      - Agendamento sujeito à disponibilidade
      - Não válido para texturas especiais
    `,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    gallery: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
      'https://images.unsplash.com/photo-1604335398480-e8c0ef07f5d3?w=500',
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=500',
    ],
    originalPrice: 2500,
    discountedPrice: 1750,
    discountPercentage: 30,
    provider: {
      id: '123',
      name: 'Pinturas Profissionais',
      rating: 4.8,
      reviewCount: 156,
      location: 'São Paulo, SP',
      verified: true,
      about: 'Empresa especializada em pintura residencial e comercial, com mais de 15 anos de experiência no mercado.',
      contact: {
        phone: '(11) 99999-9999',
        email: 'contato@pinturasprofissionais.com.br',
      }
    },
    validUntil: '2024-04-30',
    terms: [
      'Promoção válida até 30/04/2024',
      'Não acumulativo com outras promoções',
      'Sujeito à disponibilidade de agenda',
      'Válido apenas para região metropolitana de São Paulo',
    ]
  }
];

async function getPromotionDetails(id: string) {
  // Em produção, isso seria uma chamada à API
  return promotions.find(promo => promo.id === id);
}

export default async function PromocaoPage({
  params
}: {
  params: { id: string }
}) {
  const promotion = await getPromotionDetails(params.id);

  if (!promotion) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Navegação */}
        <div className="mb-6">
          <Link 
            href="/promocoes"
            className="text-gray-600 hover:text-primary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para promoções
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galeria */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-[400px]">
                  <Image
                    src={promotion.image}
                    alt={promotion.title}
                    fill
                    className="object-cover"
                  />
                  <Badge 
                    className="absolute top-4 right-4 bg-ifood-red text-white text-lg px-4 py-1"
                  >
                    {promotion.discountPercentage}% OFF
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2">
                  {promotion.gallery.map((image, index) => (
                    <div key={index} className="relative h-24">
                      <Image
                        src={image}
                        alt={`Galeria ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Informações do Serviço */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {promotion.title}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{promotion.provider.rating}</span>
                    <span className="text-gray-500">
                      ({promotion.provider.reviewCount} avaliações)
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-1" />
                    {promotion.provider.location}
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-600 mb-6">
                    {promotion.description}
                  </p>
                  <div className="whitespace-pre-line text-gray-600">
                    {promotion.fullDescription}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termos e Condições */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Termos e Condições</h2>
                <ul className="space-y-2">
                  {promotion.terms.map((term, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Preço e Agendamento */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="mb-6">
                  <span className="text-sm text-gray-500 line-through block">
                    De R$ {promotion.originalPrice.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-ifood-red">
                      R$ {promotion.discountedPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-ifood-red text-white">
                      {promotion.discountPercentage}% OFF
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-6">
                  <Clock className="w-4 h-4 mr-2" />
                  Válido até {new Date(promotion.validUntil).toLocaleDateString()}
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Agora
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card do Prestador */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">{promotion.provider.name}</h2>
                  {promotion.provider.verified && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>

                <p className="text-gray-600 mb-4">{promotion.provider.about}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{promotion.provider.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{promotion.provider.contact.email}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link 
                    href={`/empresas/${promotion.provider.id}`}
                    className="text-primary hover:underline"
                  >
                    Ver perfil completo
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 