'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle2,
  Info,
  Calendar,
  MessageSquare
} from 'lucide-react';

// Types
interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: {
    value: number;
    unit: string;
    min?: number;
    max?: number;
  };
  estimatedDuration: {
    value: number;
    unit: string;
    min?: string;
    max?: string;
  };
  category: string;
  images: string[];
  includes: string[];
  requirements: string[];
  warranty: string;
  isAvailable: boolean;
}

interface Company {
  id: string;
  nome: string;
  rating: number;
  reviewCount: number;
  contato: {
    telefone: string;
    email: string;
  };
  endereco: {
    cidade: string;
    estado: string;
  };
}

// Mock data - em produção viria da API
const mockServiceData: Record<string, ServiceDetail> = {
  '1': {
    id: '1',
    name: 'Instalação Elétrica Residencial',
    description: 'Serviço completo de instalação elétrica para residências',
    longDescription: 'Serviço completo de instalação elétrica residencial incluindo planejamento, execução e testes. Trabalhamos com materiais de primeira qualidade e seguimos todas as normas técnicas de segurança. Nossa equipe é especializada e certificada para garantir a melhor qualidade no serviço.',
    price: {
      value: 120,
      unit: 'hour',
      min: 150,
      max: 500
    },
    estimatedDuration: {
      value: 4,
      unit: 'hour',
      min: '2 horas',
      max: '8 horas'
    },
    category: 'Instalação',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'
    ],
    includes: [
      'Avaliação inicial do local',
      'Material básico para instalação',
      'Instalação conforme normas técnicas',
      'Testes de funcionamento',
      'Certificado de garantia',
      'Limpeza do local após o serviço'
    ],
    requirements: [
      'Local acessível para realização do serviço',
      'Planta elétrica da residência (se disponível)',
      'Especificações dos equipamentos a serem instalados',
      'Energia elétrica disponível no local'
    ],
    warranty: '90 dias para instalação e componentes utilizados',
    isAvailable: true
  },
  '2': {
    id: '2',
    name: 'Manutenção Preventiva Elétrica',
    description: 'Verificação e manutenção preventiva de instalações elétricas',
    longDescription: 'Serviço de manutenção preventiva completa para identificar e corrigir problemas antes que se tornem emergências. Inclui verificação de toda a instalação elétrica, testes de segurança e relatório detalhado.',
    price: {
      value: 80,
      unit: 'hour',
      min: 100,
      max: 300
    },
    estimatedDuration: {
      value: 2,
      unit: 'hour',
      min: '1 hora',
      max: '4 horas'
    },
    category: 'Manutenção',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'
    ],
    includes: [
      'Inspeção visual completa',
      'Teste de funcionamento',
      'Verificação de segurança',
      'Relatório técnico',
      'Recomendações de melhorias'
    ],
    requirements: [
      'Acesso a todos os pontos elétricos',
      'Desligamento temporário da energia',
      'Presença do responsável'
    ],
    warranty: '30 dias para o serviço realizado',
    isAvailable: true
  },
  '3': {
    id: '3',
    name: 'Instalação de Lustres e Luminárias',
    description: 'Instalação profissional de lustres, luminárias e spots',
    longDescription: 'Instalação especializada de lustres, luminárias, spots e sistemas de iluminação. Garantimos a instalação segura e o funcionamento perfeito de todos os tipos de iluminação.',
    price: {
      value: 100,
      unit: 'hour',
      min: 80,
      max: 200
    },
    estimatedDuration: {
      value: 1,
      unit: 'hour',
      min: '30 minutos',
      max: '2 horas'
    },
    category: 'Instalação',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60'
    ],
    includes: [
      'Instalação completa',
      'Teste de funcionamento',
      'Ajustes finais',
      'Limpeza do local'
    ],
    requirements: [
      'Ponto de energia disponível',
      'Acesso ao local de instalação',
      'Lustre ou luminária já adquirida'
    ],
    warranty: '60 dias para instalação',
    isAvailable: true
  }
};

const mockCompanyData: Record<string, Company> = {
  '1': {
    id: '1',
    nome: 'Eletrotec Instalações',
    rating: 4.8,
    reviewCount: 156,
    contato: {
      telefone: '(11) 99999-9999',
      email: 'contato@eletrotec.com.br'
    },
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP'
    }
  }
};

export default function ServiceDetailPage() {
  const params = useParams();
  const empresaId = params.id as string;
  const servicoId = params.servicoId as string;
  
  const [selectedImage, setSelectedImage] = useState(0);

  const service = mockServiceData[servicoId];
  const company = mockCompanyData[empresaId];

  if (!service || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Serviço não encontrado</h1>
          <p className="text-gray-600">O serviço que você está procurando não existe.</p>
          <Link href="/servicos">
            <Button className="mt-4">Voltar para Serviços</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSolicitarOrcamento = () => {
    // Por enquanto, apenas um alert. Depois pode ser um modal ou redirecionamento
    alert(`Solicitação de orçamento para "${service.name}" será implementada em breve!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href={`/empresas/${empresaId}/perfil`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar para {company.nome}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header do Serviço */}
            <Card>
              <CardContent className="p-6">
                {/* Galeria de Imagens */}
                <div className="mb-6">
                  <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={service.images[selectedImage]}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 67vw, 50vw"
                      priority
                    />
                  </div>
                  {service.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {service.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                            selectedImage === index ? 'border-primary' : 'border-gray-200'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${service.name} - Imagem ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Informações do Serviço */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
                      <Badge variant="secondary">{service.category}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-2xl font-bold text-primary">
                        <DollarSign className="w-6 h-6" />
                        {service.price.min && service.price.max ? (
                          <span>R$ {service.price.min} - R$ {service.price.max}</span>
                        ) : (
                          <span>R$ {service.price.value}/{service.price.unit === 'hour' ? 'hora' : service.price.unit}</span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {service.estimatedDuration.min && service.estimatedDuration.max 
                            ? `${service.estimatedDuration.min} - ${service.estimatedDuration.max}`
                            : `${service.estimatedDuration.value} ${service.estimatedDuration.unit === 'hour' ? 'horas' : service.estimatedDuration.unit}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{service.longDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* O que está incluído */}
            <Card>
              <CardHeader>
                <CardTitle>O que está incluído</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.includes.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card>
              <CardHeader>
                <CardTitle>Requisitos necessários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {service.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start">
                      <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Garantia */}
            <Card>
              <CardHeader>
                <CardTitle>Garantia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{service.warranty}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre a empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{company.nome}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{company.rating}</span>
                    <span className="text-gray-500 ml-1">({company.reviewCount} avaliações)</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{company.endereco.cidade}, {company.endereco.estado}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{company.contato.telefone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{company.contato.email}</span>
                  </div>
                </div>

                <Separator />

                <Link href={`/empresas/${empresaId}/perfil`}>
                  <Button variant="outline" className="w-full">
                    Ver perfil completo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSolicitarOrcamento}
                  disabled={!service.isAvailable}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Solicitar Orçamento
                </Button>
                
                <Button variant="outline" className="w-full" size="lg">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Conversar
                </Button>

                {!service.isAvailable && (
                  <p className="text-sm text-red-600 text-center">
                    Este serviço não está disponível no momento
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 