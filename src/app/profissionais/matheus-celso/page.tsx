'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  MessageCircle,
  Calendar,
  Share2,
  Building2,
  CheckCircle,
  Award,
  Users,
  Briefcase,
  FileText,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink,
  Crown,
  Sparkles,
  Heart,
  Bookmark,
  Send,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dados completos do Matheus Celso
const matheusProfile = {
  id: 'matheus-celso-contratto',
  name: 'Matheus Celso',
  company: 'Contratto',
  position: 'CEO',
  age: 25,
  experience: '2 anos',
  email: 'supervisor@contrattoex.com',
  phone: '45984157928',
  address: {
    street: 'Rua Paraná',
    number: '2781',
    neighborhood: 'Centro',
    city: 'Cascavel',
    state: 'PR',
    zipCode: '85810-010'
  },
  specialties: ['Contabilidade', 'Fiscal', 'Societário', 'Paralegal'],
  description: 'CEO da Contratto com 2 anos de experiência em contabilidade. Especialista em serviços fiscais, societários e paralegal, oferecendo soluções completas para empresas e profissionais autônomos. Formado em Ciências Contábeis, com especialização em gestão tributária e consultoria empresarial.',
  image: '/matheus-celso.png',
  rating: 4.9,
  reviews: 47,
  isSponsored: true,
  verified: true,
  available: true,
  responseTime: '< 2 horas',
  completedProjects: 156,
  clientSatisfaction: 98,
  website: 'www.contrattoex.com',
  linkedin: 'linkedin.com/in/matheuscelso',
  workingHours: {
    weekdays: '08:00 - 18:00',
    saturday: '09:00 - 12:00',
    sunday: 'Fechado'
  }
};

// Serviços oferecidos
const services = [
  {
    id: '1',
    name: 'Contabilidade Empresarial',
    description: 'Serviços completos de contabilidade para empresas de todos os portes, incluindo escrituração fiscal e contábil.',
    price: 'A partir de R$ 800,00/mês',
    duration: 'Mensal',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    category: 'Contabilidade'
  },
  {
    id: '2',
    name: 'Consultoria Fiscal',
    description: 'Planejamento tributário e consultoria especializada para otimização fiscal da sua empresa.',
    price: 'R$ 250,00/hora',
    duration: 'Por hora',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
    category: 'Fiscal'
  },
  {
    id: '3',
    name: 'Serviços Societários',
    description: 'Abertura de empresas, alterações contratuais e demais procedimentos societários.',
    price: 'Sob consulta',
    duration: 'Conforme serviço',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    category: 'Societário'
  },
  {
    id: '4',
    name: 'Serviços Paralegal',
    description: 'Assessoria jurídica em questões tributárias e empresariais.',
    price: 'R$ 180,00/hora',
    duration: 'Por hora',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
    category: 'Paralegal'
  }
];

// Avaliações dos clientes
const reviews = [
  {
    id: '1',
    clientName: 'Ana Silva',
    clientInitials: 'AS',
    rating: 5,
    date: '20/02/2024',
    comment: 'Excelente profissional! Matheus resolveu todas as questões fiscais da minha empresa com muita competência e agilidade. Recomendo!'
  },
  {
    id: '2',
    clientName: 'Carlos Oliveira',
    clientInitials: 'CO',
    rating: 5,
    date: '15/02/2024',
    comment: 'Serviço de primeira qualidade. Muito atencioso e sempre disponível para esclarecer dúvidas. A Contratto está de parabéns!'
  },
  {
    id: '3',
    clientName: 'Fernanda Costa',
    clientInitials: 'FC',
    rating: 4,
    date: '10/02/2024',
    comment: 'Profissional jovem, mas muito experiente. Me ajudou na abertura da minha empresa e no planejamento tributário. Muito satisfeita!'
  }
];

// Galeria de trabalhos
const portfolio = [
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
];

export default function MatheusPerfilPage() {
  const [activeTab, setActiveTab] = useState('sobre');

  const formatPhone = (phone: string) => {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/profissionais">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
                <Crown className="w-3 h-3 mr-1" />
                PATROCINADO
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header do Perfil */}
            <Card className="relative overflow-hidden border-2 border-yellow-400">
              {/* Efeito de brilho */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 relative">
                      <Image
                        src={matheusProfile.image}
                        alt={matheusProfile.name}
                        fill
                        className="rounded-full object-cover border-4 border-yellow-400"
                        priority
                      />
                      {matheusProfile.verified && (
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{matheusProfile.name}</h1>
                      <Sparkles className="w-6 h-6 text-yellow-500" />
                    </div>
                    <p className="text-xl text-gray-600 mb-2">{matheusProfile.position} • {matheusProfile.company}</p>
                    <p className="text-gray-500 mb-4">{matheusProfile.age} anos • {matheusProfile.experience} de experiência</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{matheusProfile.rating}</span>
                        <span>({matheusProfile.reviews} avaliações)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{matheusProfile.address.city} - {matheusProfile.address.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{matheusProfile.completedProjects} projetos</span>
                      </div>
                    </div>

                    {matheusProfile.available && (
                      <div className="flex items-center gap-1 text-green-600 text-sm mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Disponível agora • Responde em {matheusProfile.responseTime}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </Button>
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar Agora
                      </Button>
                      <Button variant="outline">
                        <Heart className="w-4 h-4 mr-2" />
                        Favoritar
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs de Conteúdo */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sobre">Sobre</TabsTrigger>
                <TabsTrigger value="servicos">Serviços</TabsTrigger>
                <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
              </TabsList>

              <TabsContent value="sobre" className="space-y-6">
                {/* Sobre o Profissional */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-gray-600" />
                      <h2 className="text-xl font-semibold">Sobre o Profissional</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {matheusProfile.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{matheusProfile.completedProjects}</div>
                        <div className="text-sm text-gray-600">Projetos Concluídos</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">{matheusProfile.clientSatisfaction}%</div>
                        <div className="text-sm text-gray-600">Satisfação dos Clientes</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600 mb-1">{matheusProfile.rating}</div>
                        <div className="text-sm text-gray-600">Avaliação Média</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Especialidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {matheusProfile.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Horário de Funcionamento */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold">Horário de Funcionamento</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Segunda a Sexta:</span>
                        <span className="font-medium">{matheusProfile.workingHours.weekdays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sábado:</span>
                        <span className="font-medium">{matheusProfile.workingHours.saturday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Domingo:</span>
                        <span className="font-medium text-red-600">{matheusProfile.workingHours.sunday}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="servicos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Serviços Oferecidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {services.map((service) => (
                        <div key={service.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            <Image
                              src={service.image}
                              alt={service.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{service.name}</h3>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{service.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-gray-500">Duração: {service.duration}</span>
                              <span className="font-bold text-lg text-green-600">{service.price}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">Solicitar Orçamento</Button>
                              <Button size="sm" variant="outline" className="flex-1">Contratar</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfólio de Trabalhos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {portfolio.map((image, index) => (
                        <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`Trabalho ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="avaliacoes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliações dos Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-1">{matheusProfile.rating}</div>
                        <div className="flex items-center gap-1 mb-1 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">Baseado em {matheusProfile.reviews} avaliações</div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : 3}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{rating === 5 ? 75 : rating === 4 ? 20 : 3}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                              {review.clientInitials}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{review.clientName}</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de Contato Rápido */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contato Rápido</h3>
                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    {formatPhone(matheusProfile.phone)}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Localização</h3>
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{matheusProfile.address.street}, {matheusProfile.address.number}</p>
                  <p>{matheusProfile.address.neighborhood}</p>
                  <p>{matheusProfile.address.city} - {matheusProfile.address.state}</p>
                  <p>CEP: {matheusProfile.address.zipCode}</p>
                </div>
              </CardContent>
            </Card>

            {/* Credenciais */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Credenciais</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Profissional Verificado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Formação em Contabilidade</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">CEO da Contratto</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Resposta rápida garantida</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Redes Sociais</h3>
                <div className="space-y-3">
                  <a href={`https://${matheusProfile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:underline">
                    <Globe className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{matheusProfile.website}</span>
                  </a>
                  <a href={`https://${matheusProfile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:underline">
                    <ExternalLink className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 