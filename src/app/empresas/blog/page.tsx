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
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Settings,
  Plus,
  ChevronRight,
  Heart,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dados mockados para a empresa
const mockCompany = {
  id: 'preview-empresa',
  user_id: 'preview-empresa',
  cnpj: '12.345.678/0001-90',
  razao_social: 'INOVACAO DIGITAL SERVICOS LTDA',
  nome_fantasia: 'iServiços',
  inscricao_estadual: '123456789',
  responsible_name: 'João Silva',
  logo_url: undefined,
  website: 'www.iservicos.com.br',
  description: 'Empresa líder em soluções digitais e serviços tecnológicos. Especializamos em desenvolvimento de software, consultoria em transformação digital e gestão de projetos. Com mais de 8 anos de experiência no mercado, ajudamos empresas a otimizar seus processos e alcançar o sucesso digital.',
  address_street: 'Rua das Inovações',
  address_number: '1234',
  address_complement: 'Sala 567',
  address_neighborhood: 'Centro Tecnológico',
  address_city: 'São Paulo',
  address_state: 'SP',
  address_zip_code: '01234-567',
  contact_phone: '(11) 9999-8888',
  contact_email: 'contato@iservicos.com.br',
  contact_whatsapp: '(11) 9999-8888',
  business_hours: {
    weekdays: { start: '08:00', end: '18:00', enabled: true },
    saturday: { start: '09:00', end: '13:00', enabled: true },
    sunday: { start: '', end: '', enabled: false }
  },
  created_at: '2016-01-15T00:00:00Z',
  updated_at: new Date().toISOString()
};

const mockServices = [
  {
    id: '1',
    name: 'Desenvolvimento de Software',
    description: 'Criação de sistemas web e mobile personalizados para sua empresa',
    price: 'A partir de R$ 15.000,00',
    duration: 'Conforme projeto',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop',
    isOnline: true,
    category: 'Tecnologia'
  },
  {
    id: '2',
    name: 'Consultoria em Transformação Digital',
    description: 'Estratégias e implementação de soluções digitais para sua empresa',
    price: 'R$ 350,00/hora',
    duration: 'Conforme necessidade',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
    isOnline: true,
    category: 'Consultoria'
  },
  {
    id: '3',
    name: 'Gestão de Projetos',
    description: 'Planejamento e execução de projetos com metodologias ágeis',
    price: 'R$ 2.500,00/mês',
    duration: 'Mensal',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop',
    isOnline: false,
    category: 'Gestão'
  },
  {
    id: '4',
    name: 'Automação de Processos',
    description: 'Automatização de tarefas e otimização de workflows empresariais',
    price: 'Sob consulta',
    duration: 'Conforme complexidade',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    isOnline: true,
    category: 'Automação'
  }
];

const mockStats = [
  { number: '150+', label: 'Projetos Entregues' },
  { number: '98%', label: 'Satisfação do Cliente' },
  { number: '8', label: 'Anos de Experiência' },
  { number: '24h', label: 'Suporte Técnico' }
];

const mockDashboardData = {
  totalVisualizacoes: 1847,
  crescimentoMensal: 12.5,
  totalLikes: 89,
  totalSalvos: 34,
  novosPedidos: 7,
  faturamentoMes: 45670.00,
  avaliacaoMedia: 4.8,
  posicaoRanking: 3
};

const galleryImages = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop'
];

export default function EmpresaBlogPage() {
  const [activeTab, setActiveTab] = useState('preview');

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const getBusinessHoursText = (businessHours: any) => {
    if (!businessHours) return 'Horário não informado';
    
    const { weekdays, saturday, sunday } = businessHours;
    let text = '';
    
    if (weekdays?.enabled) {
      text += `Seg-Sex: ${weekdays.start} às ${weekdays.end}`;
    }
    
    if (saturday?.enabled) {
      text += text ? ` | Sáb: ${saturday.start} às ${saturday.end}` : `Sáb: ${saturday.start} às ${saturday.end}`;
    }
    
    if (sunday?.enabled) {
      text += text ? ` | Dom: ${sunday.start} às ${sunday.end}` : `Dom: ${sunday.start} às ${sunday.end}`;
    }
    
    return text || 'Horário não informado';
  };

  const CompanyLogo = () => (
    <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xl md:text-3xl">
      iS
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/empresas">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Prévia do Perfil da Empresa</h1>
                <p className="text-gray-600 text-sm">Visualize como será o perfil privado da sua empresa</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Modo Prévia
              </Badge>
              <Button size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Prévia Pública</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="management">Gestão</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            {/* Header da Empresa */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <CompanyLogo />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold">{mockCompany.nome_fantasia}</h1>
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-gray-600 mb-3">{mockCompany.razao_social}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">4.8</span>
                        <span>(127 avaliações)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{mockCompany.address_city} - {mockCompany.address_state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>8 anos no mercado</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <Phone className="w-4 h-4 mr-2" />
                        Entrar em Contato
                      </Button>
                      <Button variant="outline">
                        <Heart className="w-4 h-4 mr-2" />
                        Favoritar
                      </Button>
                      <Button variant="outline">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Salvar
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Sobre a Empresa */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-gray-600" />
                      <h2 className="text-xl font-semibold">Sobre a Empresa</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {mockCompany.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mockStats.map((stat, index) => (
                        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{stat.number}</div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-gray-900 mb-3">Horário de Funcionamento</h3>
                      <p className="text-gray-600">{getBusinessHoursText(mockCompany.business_hours)}</p>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Redes Sociais</h3>
                      <div className="flex gap-3">
                        <Button variant="outline" size="icon">
                          <Facebook className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Instagram className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Serviços */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Serviços</h2>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Serviço
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockServices.map((service) => (
                        <div key={service.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            <Image
                              src={service.image}
                              alt={service.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge variant={service.isOnline ? "default" : "secondary"}>
                                {service.isOnline ? "Online" : "Presencial"}
                              </Badge>
                            </div>
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
                              <span className="font-bold text-lg">{service.price}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">Orçamento</Button>
                              <Button size="sm" variant="outline" className="flex-1">Contratar</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Galeria */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Galeria</h2>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Foto
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryImages.map((image, index) => (
                        <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`Galeria ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Avaliações */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Avaliações e Comentários</h2>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-1">4,8</div>
                        <div className="flex items-center gap-1 mb-1 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">Baseado em 127 avaliações</div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{rating === 5 ? 70 : rating === 4 ? 20 : 5}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full mb-6">Escrever avaliação</Button>

                    <div className="border-t pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          MR
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">Maria Regina</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">15/02/2024</span>
                          </div>
                          <p className="text-gray-600">Excelente empresa! Desenvolveram nosso sistema com muito profissionalismo e entregaram no prazo. Recomendo!</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Localização */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Localização</h3>
                    <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{mockCompany.address_street}, {mockCompany.address_number}</p>
                      {mockCompany.address_complement && <p>{mockCompany.address_complement}</p>}
                      <p>{mockCompany.address_neighborhood}</p>
                      <p>{mockCompany.address_city} - {mockCompany.address_state}</p>
                      <p>CEP: {mockCompany.address_zip_code}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Confiabilidade */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Confiabilidade</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">8+ anos de experiência</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Certificação ISO 9001</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Suporte 24/7</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">CNPJ: {formatCNPJ(mockCompany.cnpj)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contato */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Contato</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm">{formatPhone(mockCompany.contact_phone || '')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm">{mockCompany.contact_email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <a href={`https://${mockCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {mockCompany.website}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard Privado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Visualizações</p>
                      <p className="text-2xl font-bold">{mockDashboardData.totalVisualizacoes.toLocaleString()}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">+{mockDashboardData.crescimentoMensal}%</span>
                    <span className="text-gray-600 ml-1">este mês</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Curtidas</p>
                      <p className="text-2xl font-bold">{mockDashboardData.totalLikes}</p>
                    </div>
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-600">+12 esta semana</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Novos Pedidos</p>
                      <p className="text-2xl font-bold">{mockDashboardData.novosPedidos}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-600">Últimas 24h</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Faturamento</p>
                      <p className="text-2xl font-bold">R$ {mockDashboardData.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-600">Este mês</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visualizações por Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p>Gráfico de visualizações</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance dos Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockServices.map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600">{service.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ {(Math.random() * 10000 + 1000).toFixed(0)}</p>
                          <p className="text-sm text-gray-600">{Math.floor(Math.random() * 20 + 5)} pedidos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Avaliação Média</h3>
                  <p className="text-3xl font-bold text-yellow-600">{mockDashboardData.avaliacaoMedia}</p>
                  <p className="text-sm text-gray-600">De 5 estrelas</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Posição no Ranking</h3>
                  <p className="text-3xl font-bold text-blue-600">#{mockDashboardData.posicaoRanking}</p>
                  <p className="text-sm text-gray-600">Na sua categoria</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Bookmark className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Perfis Salvos</h3>
                  <p className="text-3xl font-bold text-purple-600">{mockDashboardData.totalSalvos}</p>
                  <p className="text-sm text-gray-600">Este mês</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {/* Gestão do Perfil */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Configurações</h3>
                  <p className="text-sm text-gray-600 mb-4">Gerencie informações básicas e configurações do perfil</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Acessar
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Serviços</h3>
                  <p className="text-sm text-gray-600 mb-4">Adicione, edite ou remova serviços do seu portfólio</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Gerenciar
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Avaliações</h3>
                  <p className="text-sm text-gray-600 mb-4">Visualize e responda às avaliações dos clientes</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Todas
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">Acompanhe métricas detalhadas de performance</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Relatórios
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Mensagens</h3>
                  <p className="text-sm text-gray-600 mb-4">Centro de mensagens e comunicação com clientes</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Abrir Chat
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Agenda</h3>
                  <p className="text-sm text-gray-600 mb-4">Gerencie horários e agendamentos de serviços</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Agenda
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="h-16">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Serviço
                  </Button>
                  <Button variant="outline" className="h-16">
                    <Edit className="w-5 h-5 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button variant="outline" className="h-16">
                    <Share2 className="w-5 h-5 mr-2" />
                    Compartilhar
                  </Button>
                  <Button variant="outline" className="h-16">
                    <FileText className="w-5 h-5 mr-2" />
                    Relatórios
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Últimas Atividades */}
            <Card>
              <CardHeader>
                <CardTitle>Últimas Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="font-medium">Novo pedido recebido</p>
                      <p className="text-sm text-gray-600">Desenvolvimento de Software - há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="font-medium">Avaliação 5 estrelas recebida</p>
                      <p className="text-sm text-gray-600">De Maria Regina - há 1 dia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    <div>
                      <p className="font-medium">Perfil visualizado 47 vezes</p>
                      <p className="text-sm text-gray-600">Hoje</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 