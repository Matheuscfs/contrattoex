'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
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
  Briefcase,
  Award,
  Building2,
  WrenchIcon,
  CheckCircle
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: {
    min: number;
    max: number;
  };
  isAvailable: boolean;
  category: string;
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

interface ProfileData {
  id: string;
  type: 'professional' | 'company';
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  description: string;
  location: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  specialties: string[];
  experience?: string;
  certifications?: {
    name: string;
    institution: string;
    year: string;
  }[];
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  services: Service[];
  reviews: Review[];
}

// Mock data - em produção isso viria da API
const mockProfileData: ProfileData = {
  id: '1',
  type: 'professional',
  name: 'Pedro Santos',
  photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60',
  rating: 4.8,
  reviewCount: 156,
  description: 'Eletricista profissional com mais de 15 anos de experiência em instalações residenciais e comerciais.',
  location: 'São Paulo, SP',
  contact: {
    phone: '(11) 98765-4321',
    email: 'pedro.santos@email.com',
    website: 'www.eletricistapedro.com.br'
  },
  specialties: ['Instalações Elétricas', 'Manutenção Preventiva', 'Projetos Elétricos'],
  experience: '15 anos de experiência',
  certifications: [
    {
      name: 'NR-10',
      institution: 'SENAI',
      year: '2023'
    },
    {
      name: 'Instalações Elétricas Prediais',
      institution: 'CREA',
      year: '2022'
    }
  ],
  workingHours: {
    start: '08:00',
    end: '18:00',
    days: ['Segunda à Sexta', 'Sábado']
  },
  services: [
    {
      id: '1',
      name: 'Instalação Elétrica Residencial',
      description: 'Instalação completa ou parcial de sistema elétrico residencial',
      price: {
        min: 150,
        max: 500
      },
      isAvailable: true,
      category: 'Instalação'
    },
    {
      id: '2',
      name: 'Manutenção Preventiva',
      description: 'Verificação e manutenção do sistema elétrico',
      price: {
        min: 100,
        max: 300
      },
      isAvailable: true,
      category: 'Manutenção'
    }
  ],
  reviews: [
    {
      id: '1',
      clientName: 'Roberto Silva',
      rating: 5,
      comment: 'Excelente profissional, muito pontual e organizado.',
      date: '2024-03-15',
      service: 'Instalação Elétrica'
    },
    {
      id: '2',
      clientName: 'Ana Paula',
      rating: 4.8,
      comment: 'Fez um ótimo trabalho na manutenção da rede elétrica.',
      date: '2024-03-10',
      service: 'Manutenção Preventiva'
    }
  ]
};

const mockCompanyData: ProfileData = {
  id: '2',
  type: 'company',
  name: 'Serviços Profissionais Ltda',
  photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60',
  rating: 4.9,
  reviewCount: 324,
  description: 'Empresa especializada em serviços residenciais e comerciais com mais de 10 anos de experiência.',
  location: 'São Paulo, SP',
  contact: {
    phone: '(11) 3456-7890',
    email: 'contato@proservices.com.br',
    website: 'www.proservices.com.br'
  },
  specialties: ['Limpeza', 'Manutenção', 'Reformas'],
  workingHours: {
    start: '08:00',
    end: '18:00',
    days: ['Segunda à Sexta']
  },
  services: [
    {
      id: '1',
      name: 'Limpeza Residencial',
      description: 'Limpeza completa de residências',
      price: {
        min: 120,
        max: 400
      },
      isAvailable: true,
      category: 'Limpeza'
    },
    {
      id: '2',
      name: 'Reforma de Banheiro',
      description: 'Reforma completa de banheiros',
      price: {
        min: 3000,
        max: 8000
      },
      isAvailable: true,
      category: 'Reformas'
    }
  ],
  reviews: [
    {
      id: '1',
      clientName: 'Maria Silva',
      rating: 5,
      comment: 'Excelente serviço de limpeza, equipe muito profissional.',
      date: '2024-03-10',
      service: 'Limpeza Residencial'
    },
    {
      id: '2',
      clientName: 'João Santos',
      rating: 4.5,
      comment: 'Ótimo trabalho na reforma do banheiro, apenas um pequeno atraso na entrega.',
      date: '2024-03-05',
      service: 'Reforma'
    }
  ]
};

export default function PublicProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    // Simula chamada à API
    const data = params.type === 'empresa' ? mockCompanyData : mockProfileData;
    setProfile(data);
  }, [params.type]);

  if (!profile) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-[1024px] mx-auto">
        {/* Header com Informações Principais */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={profile.photo}
                    alt={profile.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-gray-500">{profile.type === 'professional' ? 'Profissional' : 'Empresa'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 font-semibold">{profile.rating}</span>
                      <span className="text-gray-500 ml-1">({profile.reviewCount} avaliações)</span>
                    </div>
                    <Button className="ml-4">Solicitar Orçamento</Button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-gray-600">{profile.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{profile.workingHours.start} - {profile.workingHours.end}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{profile.workingHours.days.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna da Esquerda */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{profile.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{profile.contact.email}</span>
                </div>
                {profile.contact.website && (
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                    <a href={`https://${profile.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {profile.contact.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {profile.type === 'professional' && profile.certifications && (
              <Card>
                <CardHeader>
                  <CardTitle>Certificações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-primary mr-2" />
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-gray-500">{cert.institution} • {cert.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna da Direita */}
          <div className="md:col-span-2 space-y-6">
            {/* Serviços */}
            <Card>
              <CardHeader>
                <CardTitle>Serviços Disponíveis</CardTitle>
                <CardDescription>Lista de serviços oferecidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium flex items-center">
                            <WrenchIcon className="w-4 h-4 mr-2 text-primary" />
                            {service.name}
                            {service.isAvailable && (
                              <Badge variant="secondary" className="ml-2">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Disponível
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center mt-2">
                            <Badge variant="outline" className="text-xs">
                              {service.category}
                            </Badge>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              R$ {service.price.min} - R$ {service.price.max}
                            </span>
                          </div>
                        </div>
                        <Button size="sm">Solicitar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avaliações */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações</CardTitle>
                <CardDescription>Feedback dos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{review.clientName}</h3>
                          <p className="text-sm text-gray-500">{review.service}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
} 