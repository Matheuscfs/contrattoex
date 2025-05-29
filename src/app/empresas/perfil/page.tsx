'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Building2,
  Settings,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Camera,
  Briefcase,
  Users,
  FileText,
  ExternalLink,
  CheckCircle,
  Award,
  Home,
  Laptop,
  Eye
} from 'lucide-react';
import { maskCNPJ, maskPhone, maskCEP } from '@/utils/masks';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceManagement } from '@/components/services/ServiceManagement';
import { ProfileAnalytics } from '@/components/analytics/ProfileAnalytics';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Timer } from 'lucide-react';

interface CompanyProfile {
  id: string;
    cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  logo_url?: string;
  website?: string;
    description: string;
  address_street: string;
  address_number: string;
  address_complement?: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip_code: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp?: string;
  business_hours: any;
  rating: number;
  total_reviews: number;
  created_at: string;
}

interface ServiceReview {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

export default function CompanyProfileViewPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [logoImage, setLogoImage] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dados mockados da empresa UNUS
  const company: CompanyProfile = {
    id: '567417a7-a3b9-4eac-94c8-c94bff147dcb',
    cnpj: '55.888.777/0001-66',
    razao_social: 'UNUS SISTEMAS E TECNOLOGIA LTDA',
    nome_fantasia: 'UNUS',
    logo_url: '/unus-logo.png',
    website: 'www.unus.com.br',
    description: 'Empresa líder em soluções tecnológicas e desenvolvimento de software personalizado. Com mais de 15 anos de experiência no mercado, oferecemos serviços completos de automação, gestão empresarial e consultoria em TI. Nossa missão é transformar negócios através da tecnologia, proporcionando eficiência e inovação para nossos clientes.',
    address_street: 'Rua da Tecnologia',
    address_number: '500',
    address_complement: 'Conjunto 1001',
    address_neighborhood: 'Distrito Tecnológico',
    address_city: 'Cascavel',
    address_state: 'PR',
    address_zip_code: '85803-200',
    contact_phone: '(45) 3036-8800',
    contact_email: 'contato@unus.com.br',
    contact_whatsapp: '(45) 99999-0000',
    business_hours: {
      weekdays: { start: '08:00', end: '18:00', enabled: true },
      saturday: { start: '08:00', end: '12:00', enabled: true },
      sunday: { start: '', end: '', enabled: false }
    },
    rating: 4.9,
    total_reviews: 284,
    created_at: '2009-03-01T00:00:00Z'
  };

  const reviews: ServiceReview[] = [
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
  ];

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implementar lógica para salvar alterações
    console.log('Perfil atualizado:', company);
  };

  const getCompanyLogo = () => {
    return '/unus-logo.png';
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const getBusinessHoursText = (businessHours: any) => {
    if (!businessHours) return 'Não informado';
    
    const parts = [];
    if (businessHours.weekdays?.enabled) {
      parts.push(`Seg-Sex: ${businessHours.weekdays.start} às ${businessHours.weekdays.end}`);
    }
    if (businessHours.saturday?.enabled) {
      parts.push(`Sáb: ${businessHours.saturday.start} às ${businessHours.saturday.end}`);
    }
    if (businessHours.sunday?.enabled) {
      parts.push(`Dom: ${businessHours.sunday.start} às ${businessHours.sunday.end}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'Não informado';
  };

  const getCompanyAge = (createdAt: string) => {
    const years = new Date().getFullYear() - new Date(createdAt).getFullYear();
    return `${years} anos de mercado`;
  };

  const getServicesForCompany = () => {
    return [
      {
        id: '1',
        name: 'Desenvolvimento de Software Personalizado',
        description: 'Criação de sistemas sob medida para atender necessidades específicas do seu negócio',
        price: 'A partir de R$ 15.000',
        duration: '2-6 meses',
        category: 'Desenvolvimento',
        type: 'presencial_online',
        features: ['Análise de requisitos', 'Design de interface', 'Desenvolvimento', 'Testes', 'Treinamento', 'Suporte']
      },
      {
        id: '2',
        name: 'Consultoria em Automação Empresarial',
        description: 'Análise e implementação de processos automatizados para aumentar a eficiência',
        price: 'R$ 200/hora',
        duration: '1-3 meses',
        category: 'Consultoria',
        type: 'presencial',
        features: ['Diagnóstico empresarial', 'Mapeamento de processos', 'Implementação', 'Treinamento da equipe']
      },
      {
        id: '3',
        name: 'Sistemas de Gestão ERP',
        description: 'Implementação e customização de sistemas ERP para gestão completa do negócio',
        price: 'A partir de R$ 25.000',
        duration: '3-8 meses',
        category: 'ERP',
        type: 'presencial_online',
        features: ['Módulo Financeiro', 'Estoque', 'Vendas', 'Compras', 'RH', 'Relatórios gerenciais']
      },
      {
        id: '4',
        name: 'Aplicativos Mobile',
        description: 'Desenvolvimento de aplicativos nativos e híbridos para iOS e Android',
        price: 'A partir de R$ 20.000',
        duration: '3-5 meses',
        category: 'Mobile',
        type: 'online',
        features: ['Design UX/UI', 'Desenvolvimento nativo', 'APIs integradas', 'Publicação nas stores']
      },
      {
        id: '5',
        name: 'Migração para Nuvem',
        description: 'Migração segura de sistemas e dados para ambiente de nuvem',
        price: 'A partir de R$ 8.000',
        duration: '1-2 meses',
        category: 'Cloud',
        type: 'online',
        features: ['Análise de infraestrutura', 'Planejamento da migração', 'Execução', 'Monitoramento']
      }
    ];
  };

  const getGalleryImages = () => {
    return [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
        title: 'Equipe de Desenvolvimento',
        description: 'Nossa equipe trabalhando em projetos inovadores'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        title: 'Escritório Moderno',
        description: 'Ambiente colaborativo e tecnológico'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
        title: 'Sala de Reuniões',
        description: 'Espaço para planejamento e apresentações'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        title: 'Centro de Monitoramento',
        description: 'Acompanhamento 24/7 dos sistemas'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        title: 'Laboratório de Testes',
        description: 'Ambiente para testes e homologação'
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
        title: 'Treinamento e Capacitação',
        description: 'Sala dedicada ao treinamento de clientes'
      }
    ];
  };

  const getCompanyStats = () => {
    return {
      totalProjects: 1247,
      clientsSatisfaction: '98%',
      teamSize: 45,
      marketYears: getCompanyAge(company.created_at)
    };
  };

  const services = getServicesForCompany();
  const gallery = getGalleryImages();
  const stats = getCompanyStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Visualização do Perfil da Empresa</h1>
        </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
              <Link href={`/empresas/${company.id}/perfil`}>
                <Button size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Perfil Público
                </Button>
              </Link>
            </div>
                </div>
                </div>
              </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-200 mx-auto bg-white">
                      <Image
                        src={getCompanyLogo()}
                        alt={company.nome_fantasia}
                        width={128}
                        height={128}
                        className="object-contain w-full h-full p-2"
                />
              </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    {company.rating >= 4.5 && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          <Award className="w-3 h-3 mr-1" />
                          Empresa Destaque
                        </Badge>
                      </div>
                    )}
              </div>

                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {company.nome_fantasia}
                    </h1>
                    <p className="text-gray-600">
                      {company.razao_social}
                    </p>
                    <p className="text-sm text-gray-500">
                      CNPJ: {formatCNPJ(company.cnpj)}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {company.rating}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      ({company.total_reviews} avaliações)
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{company.address_city}, {company.address_state}</span>
                    </div>

                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Clock className="w-4 h-4" />
                    <span>Aberto agora</span>
                  </div>
                </div>

                {/* Contato */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contato
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{formatPhone(company.contact_phone)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{company.contact_email}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      <Link href={`https://${company.website}`} className="text-blue-600 hover:underline">
                        {company.website}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Horário de Funcionamento */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horário de Funcionamento
                  </h3>
                  <div className="text-sm text-gray-600">
                    {getBusinessHoursText(company.business_hours)}
                  </div>
                </div>

                {/* Endereço */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Endereço
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>{company.address_street}, {company.address_number}</p>
                    {company.address_complement && <p>{company.address_complement}</p>}
                    <p>{company.address_neighborhood}</p>
                    <p>{company.address_city}, {company.address_state}</p>
                    <p>CEP: {company.address_zip_code}</p>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
                      <div className="text-xs text-gray-500">Projetos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.clientsSatisfaction}</div>
                      <div className="text-xs text-gray-500">Satisfação</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{stats.teamSize}</div>
                      <div className="text-xs text-gray-500">Colaboradores</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">15</div>
                      <div className="text-xs text-gray-500">Anos</div>
                </div>
              </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre a Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Sobre a Empresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {company.description}
                </p>
            </CardContent>
          </Card>

            {/* Tabs */}
            <Tabs defaultValue="services" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="gallery">Galeria</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>

              {/* Serviços */}
              <TabsContent value="services">
          <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Nossos Serviços
                    </CardTitle>
            </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                              <p className="text-gray-600 mb-3">{service.description}</p>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              {service.category}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-lg font-bold text-blue-600">{service.price}</div>
                              <div className="text-sm text-gray-500">Preço</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                                <Timer className="w-4 h-4" />
                                {service.duration}
                              </div>
                              <div className="text-sm text-gray-500">Prazo</div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                {service.type === 'presencial' && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Home className="w-3 h-3" />
                                    Presencial
                                  </Badge>
                                )}
                                {service.type === 'online' && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Laptop className="w-3 h-3" />
                                    Online
                                  </Badge>
                                )}
                                {service.type === 'presencial_online' && (
                                  <div className="flex gap-1">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      <Home className="w-3 h-3" />
                                      Presencial
                                    </Badge>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      <Laptop className="w-3 h-3" />
                                      Online
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">Modalidade</div>
                            </div>
                          </div>

                      <div>
                            <h4 className="font-semibold text-gray-900 mb-2">O que está incluído:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                              {service.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                      </div>
                      </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Galeria */}
              <TabsContent value="gallery">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Galeria da Empresa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gallery.map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                          <div className="relative h-48 rounded-lg overflow-hidden">
                            <Image
                              src={item.url}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end p-4">
                              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm">{item.description}</p>
                              </div>
                            </div>
                          </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
              </TabsContent>

              {/* Avaliações */}
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Avaliações dos Clientes ({company.total_reviews})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Estatísticas das avaliações */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-3xl font-bold text-yellow-500">{company.rating}</div>
                            <div className="text-sm text-gray-600">Nota Média</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-blue-600">{company.total_reviews}</div>
                            <div className="text-sm text-gray-600">Total de Avaliações</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-green-600">98%</div>
                            <div className="text-sm text-gray-600">Recomendação</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-purple-600">4.2</div>
                            <div className="text-sm text-gray-600">Anos Médio Cliente</div>
                          </div>
                        </div>
                      </div>

                      {/* Últimas avaliações */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Últimas Avaliações</h3>
                        {[
                          {
                            id: '1',
                            client_name: 'Roberto Silva',
                            client_avatar: 'https://ui-avatars.com/api/?name=Roberto+Silva&background=random',
                            rating: 5,
                            comment: 'Excelente trabalho na implementação do nosso sistema ERP. Equipe muito profissional e atendimento excepcional.',
                            service: 'Sistema ERP',
                            date: '2024-01-20'
                          },
                          {
                            id: '2',
                            client_name: 'Maria Fernanda',
                            client_avatar: 'https://ui-avatars.com/api/?name=Maria+Fernanda&background=random',
                            rating: 5,
                            comment: 'A UNUS desenvolveu nosso aplicativo mobile com qualidade superior. Superou todas as expectativas!',
                            service: 'Aplicativo Mobile',
                            date: '2024-01-18'
                          },
                          {
                            id: '3',
                            client_name: 'Carlos Eduardo',
                            client_avatar: 'https://ui-avatars.com/api/?name=Carlos+Eduardo&background=random',
                            rating: 4,
                            comment: 'Ótima consultoria em automação. Conseguimos otimizar nossos processos significativamente.',
                            service: 'Consultoria em Automação',
                            date: '2024-01-15'
                          }
                        ].map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={review.client_avatar}
                                  alt={review.client_name}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">{review.client_name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    Cliente Verificado
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {review.service} • {new Date(review.date).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 