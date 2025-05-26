'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Calendar,
  WrenchIcon,
  CheckCircle,
  Info,
  DollarSign,
  Clock3,
  Shield,
  Users,
  ArrowLeft
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ServiceDetails {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: {
    min: number;
    max: number;
  };
  duration: {
    min: string;
    max: string;
  };
  category: string;
  isAvailable: boolean;
  requirements: string[];
  includes: string[];
  warranty: string;
  coverage: string[];
  provider: {
    id: string;
    type: 'professional' | 'company';
    name: string;
    photo: string;
    rating: number;
    reviewCount: number;
    location: string;
    experience?: string;
    workingHours: {
      start: string;
      end: string;
      days: string[];
    };
  };
  reviews: {
    id: string;
    clientName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

// Mock data - em produção isso viria da API
const mockServiceDetails: ServiceDetails = {
  id: '1',
  name: 'Instalação Elétrica Residencial',
  description: 'Instalação completa ou parcial de sistema elétrico residencial',
  longDescription: 'Serviço completo de instalação elétrica para residências, incluindo planejamento, execução e testes. Trabalhamos com as melhores práticas do mercado e seguimos todas as normas técnicas necessárias para garantir a segurança e qualidade do serviço.',
  price: {
    min: 150,
    max: 500
  },
  duration: {
    min: '2 horas',
    max: '8 horas'
  },
  category: 'Instalação',
  isAvailable: true,
  requirements: [
    'Local acessível para realização do serviço',
    'Planta elétrica da residência (se disponível)',
    'Especificações dos equipamentos a serem instalados'
  ],
  includes: [
    'Avaliação inicial do local',
    'Material básico para instalação',
    'Instalação conforme normas técnicas',
    'Testes de funcionamento',
    'Certificado de garantia'
  ],
  warranty: '90 dias para instalação e componentes utilizados',
  coverage: ['São Paulo - SP', 'Guarulhos - SP', 'ABC Paulista'],
  provider: {
    id: '1',
    type: 'professional',
    name: 'Pedro Santos',
    photo: '/placeholder-professional.jpg',
    rating: 4.8,
    reviewCount: 156,
    location: 'São Paulo, SP',
    experience: '15 anos de experiência',
    workingHours: {
      start: '08:00',
      end: '18:00',
      days: ['Segunda à Sexta', 'Sábado']
    }
  },
  reviews: [
    {
      id: '1',
      clientName: 'Roberto Silva',
      rating: 5,
      comment: 'Excelente profissional, muito pontual e organizado. Fez um trabalho impecável na instalação elétrica da minha casa.',
      date: '2024-03-15'
    },
    {
      id: '2',
      clientName: 'Ana Paula',
      rating: 4.8,
      comment: 'Profissional muito competente e atencioso. Explicou todo o processo e fez um ótimo trabalho.',
      date: '2024-03-10'
    }
  ],
  faqs: [
    {
      question: 'Qual o prazo médio para realização do serviço?',
      answer: 'O prazo varia de acordo com a complexidade da instalação, mas geralmente leva entre 2 a 8 horas para ser concluído.'
    },
    {
      question: 'O material está incluso no serviço?',
      answer: 'O material básico para instalação está incluso. Materiais específicos ou de maior valor serão orçados separadamente.'
    },
    {
      question: 'Qual a garantia do serviço?',
      answer: 'Oferecemos 90 dias de garantia para a instalação e os componentes utilizados.'
    }
  ]
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const [service, setService] = useState<ServiceDetails | null>(null);

  useEffect(() => {
    // Simula chamada à API
    setService(mockServiceDetails);
  }, []);

  if (!service) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-[1024px] mx-auto">
        <div className="mb-6">
          <Link 
            href="/servicos" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar para serviços
          </Link>
        </div>

        {/* Header do Serviço */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
                    <p className="text-gray-500">{service.category}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        R$ {service.price.min} - R$ {service.price.max}
                      </span>
                    </div>
                    <Button size="lg">Solicitar Orçamento</Button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600">{service.longDescription}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center text-gray-600">
                    <Clock3 className="w-4 h-4 mr-2 text-primary" />
                    <span>Duração: {service.duration.min} - {service.duration.max}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    <span>Garantia: {service.warranty}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>Atende: {service.coverage.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna da Esquerda */}
          <div className="space-y-6">
            {/* Card do Prestador */}
            <Card>
              <CardHeader>
                <CardTitle>Prestador do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Link 
                    href={`/perfil/${service.provider.type}/${service.provider.id}`}
                    className="group flex items-center gap-4 hover:opacity-90 transition-opacity"
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={service.provider.photo}
                        alt={service.provider.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">{service.provider.name}</h3>
                      <p className="text-sm text-gray-500">
                        {service.provider.type === 'professional' ? 'Profissional' : 'Empresa'}
                      </p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{service.provider.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({service.provider.reviewCount} avaliações)
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{service.provider.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{service.provider.workingHours.start} - {service.provider.workingHours.end}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{service.provider.workingHours.days.join(', ')}</span>
                  </div>
                </div>

                <Link 
                  href={`/perfil/${service.provider.type}/${service.provider.id}`}
                  className="w-full"
                >
                  <Button className="w-full" variant="outline">
                    Ver Perfil Completo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card de Requisitos */}
            <Card>
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
                <CardDescription>O que é necessário para realizar o serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita */}
          <div className="md:col-span-2 space-y-6">
            {/* O que Inclui */}
            <Card>
              <CardHeader>
                <CardTitle>O que Inclui</CardTitle>
                <CardDescription>Itens e serviços inclusos</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.includes.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Avaliações */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações do Serviço</CardTitle>
                <CardDescription>O que os clientes estão dizendo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{review.clientName}</h3>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>Dúvidas comuns sobre o serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 