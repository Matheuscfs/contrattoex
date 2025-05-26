'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Clock, Phone, Mail, Globe, CheckCircle2 } from 'lucide-react';
import { CompanyServices } from '@/components/companies/CompanyServices';
import { CompanyReviews } from '@/components/companies/CompanyReviews';

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  price: {
    value: number;
    unit: string;
  };
  estimatedDuration: {
    value: number;
    unit: string;
  };
  category: string;
  images: string[];
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  service: {
    name: string;
  };
}

interface Company {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  categoria: string;
  precoHora: string;
  rating: number;
  reviews: Review[];
  tempoMedioAtendimento: string;
  distancia: string;
  empresaParceira: boolean;
  servicosDestaque: string[];
  contato: {
    telefone: string;
    email: string;
    website: string;
  };
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  horarioFuncionamento: {
    diasUteis: string;
    sabado: string;
    domingo: string;
  };
  certificacoes: string[];
  servicos: Service[];
}

// Dados mockados das empresas
const empresasData: Record<string, Company> = {
  '1': {
    id: 1,
    nome: 'Eletrotec Instalações',
    descricao: 'Empresa especializada em instalações e manutenções elétricas residenciais e comerciais',
    imagem: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
    categoria: 'Elétrica',
    precoHora: 'R$ 120',
    rating: 4.8,
    reviews: [
      {
        id: '1',
        user: { name: 'Carlos Silva', avatar: 'https://i.pravatar.cc/150?img=1' },
        rating: 5,
        comment: 'Excelente serviço, muito profissional e pontual.',
        createdAt: '2024-03-10T10:00:00Z',
        service: { name: 'Instalação Elétrica Residencial' }
      }
    ],
    tempoMedioAtendimento: '1-2 horas',
    distancia: '2.5 km',
    empresaParceira: true,
    servicosDestaque: ['Instalação', 'Manutenção', 'Projetos'],
    contato: {
      telefone: '(11) 99999-9999',
      email: 'contato@eletrotec.com.br',
      website: 'www.eletrotec.com.br'
    },
    endereco: {
      rua: 'Av. das Instalações',
      numero: '1000',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    horarioFuncionamento: {
      diasUteis: '08:00 - 18:00',
      sabado: '09:00 - 13:00',
      domingo: 'Fechado'
    },
    certificacoes: ['CREA-SP', 'NR-10', 'ISO 9001'],
    servicos: [
      {
        id: '1',
        name: 'Instalação Elétrica Residencial',
        description: 'Serviço completo de instalação elétrica para residências',
        price: { value: 120, unit: 'hour' },
        estimatedDuration: { value: 4, unit: 'hour' },
        category: 'Instalação',
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60']
      }
    ]
  }
};

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const empresaId = params.id;
  const empresa = empresasData[empresaId];

  if (!empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Empresa não encontrada</h1>
          <p className="text-gray-600">A empresa que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da Empresa */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-64 h-64">
              <Image
                src={empresa.imagem}
                alt={empresa.nome}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{empresa.nome}</h1>
                  <p className="text-gray-600">{empresa.categoria}</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{empresa.rating}</span>
                  <span className="text-gray-500 ml-1">({empresa.reviews.length} avaliações)</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{empresa.descricao}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{empresa.tempoMedioAtendimento}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{empresa.distancia}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{empresa.contato.telefone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{empresa.contato.email}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {empresa.certificacoes.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {cert}
                  </span>
                ))}
              </div>

              <Button className="w-full md:w-auto">Solicitar Orçamento</Button>
            </div>
          </div>
        </div>

        {/* Horário de Funcionamento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Horário de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium mb-1">Dias Úteis</h3>
                <p className="text-gray-600">{empresa.horarioFuncionamento.diasUteis}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Sábado</h3>
                <p className="text-gray-600">{empresa.horarioFuncionamento.sabado}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Domingo</h3>
                <p className="text-gray-600">{empresa.horarioFuncionamento.domingo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Serviços */}
        <div className="mb-6">
          <CompanyServices services={empresa.servicos} />
        </div>

        {/* Avaliações */}
        <div className="mb-6">
          <CompanyReviews reviews={empresa.reviews} />
        </div>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle>Localização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-600">
              <p>
                {empresa.endereco.rua}, {empresa.endereco.numero}
              </p>
              <p>
                {empresa.endereco.bairro} - {empresa.endereco.cidade}, {empresa.endereco.estado}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 