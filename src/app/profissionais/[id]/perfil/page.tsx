'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone,
  Mail,
  ArrowLeft,
  MessageCircle,
  Calendar,
  Share2,
  User,
  CheckCircle,
  Award,
  Users,
  Briefcase,
  FileText,
  Instagram,
  ExternalLink,
  GraduationCap,
  Heart,
  Shield,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';

interface ProfessionalProfile {
  id: string;
  user_id: string;
  cpf: string;
  name: string;
  professional_name?: string;
  registration_number?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  avatar_url?: string;
  bio?: string;
  specialties?: string[];
  experience_years?: number;
  hourly_rate?: number;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  website?: string;
  instagram?: string;
  portfolio_url?: string;
  availability?: any;
  certifications?: string[];
  languages?: string[];
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

interface ProfessionalPageProps {
  params: {
    id: string;
  };
}

function ProfessionalSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalPublicProfilePage({ params }: ProfessionalPageProps) {
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadProfessionalProfile();
  }, [params.id]);

  const loadProfessionalProfile = async () => {
    try {
      setLoading(true);
      
      // Para o ID específico fornecido, usar dados mockados
      if (params.id === '6856500e-0f6f-4ddc-9d50-217922504887') {
        setProfessional({
          id: '6856500e-0f6f-4ddc-9d50-217922504887',
          user_id: '6856500e-0f6f-4ddc-9d50-217922504887',
          cpf: '123.456.789-00',
          name: 'João Silva Santos',
          professional_name: 'João Silva - Designer & Desenvolvedor',
          registration_number: 'REG-12345',
          email: 'joao.silva@email.com',
          phone: '(45) 99999-8888',
          whatsapp: '(45) 99999-8888',
          avatar_url: undefined,
          bio: 'Designer UX/UI e Desenvolvedor Frontend com mais de 8 anos de experiência em projetos digitais. Especializado em criar interfaces intuitivas e experiências de usuário excepcionais. Trabalho com as principais tecnologias do mercado como React, Next.js, Figma e Adobe Creative Suite.',
          specialties: ['Design UX/UI', 'Desenvolvimento Frontend', 'React & Next.js', 'Figma', 'Adobe Creative Suite'],
          experience_years: 8,
          hourly_rate: 85,
          address_street: 'Rua das Flores',
          address_number: '123',
          address_complement: 'Apt 45',
          address_neighborhood: 'Centro',
          address_city: 'Cascavel',
          address_state: 'PR',
          address_zip_code: '85801-050',
          website: 'www.joaosilva.dev',
          instagram: '@joaosilvadesign',
          portfolio_url: 'www.joaosilva.dev/portfolio',
          availability: {
            weekdays: { start: '09:00', end: '18:00', available: true },
            saturday: { start: '09:00', end: '13:00', available: true },
            sunday: { start: '', end: '', available: false }
          },
          certifications: ['Google UX Design Certificate', 'Adobe Certified Expert', 'React Developer Certification'],
          languages: ['Português (Nativo)', 'Inglês (Avançado)', 'Espanhol (Intermediário)'],
          rating: 4.8,
          total_reviews: 127,
          created_at: '2020-01-15T00:00:00Z',
          updated_at: new Date().toISOString()
        });
      } else {
        // Tentar carregar do banco de dados
        const { data, error } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        setProfessional(data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do profissional:', error);
      setError('Erro ao carregar perfil do profissional');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&size=400&rounded=true`;
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const getAvailabilityText = (availability: any) => {
    if (!availability) return 'Disponibilidade não informada';
    
    if (availability.weekdays?.available) {
      return `Seg-Sex: ${availability.weekdays.start} às ${availability.weekdays.end}`;
    }
    
    return 'Disponibilidade sob consulta';
  };

  const getProfessionalAge = (createdAt: string) => {
    const years = new Date().getFullYear() - new Date(createdAt).getFullYear();
    return `${years} anos no iServiços`;
  };

  const getServicesForProfessional = (professionalId: string) => {
    // Dados mockados dos serviços do profissional
    return [
      {
        id: '1',
        name: 'Design de Interface (UI/UX)',
        description: 'Criação de interfaces modernas e intuitivas para web e mobile',
        price: 'R$ 80/hora',
        duration: '2-4 semanas',
        category: 'Design'
      },
      {
        id: '2',
        name: 'Desenvolvimento Frontend',
        description: 'Desenvolvimento de aplicações React e Next.js',
        price: 'R$ 90/hora',
        duration: '3-6 semanas',
        category: 'Desenvolvimento'
      },
      {
        id: '3',
        name: 'Consultoria em UX',
        description: 'Análise e otimização da experiência do usuário',
        price: 'R$ 100/hora',
        duration: '1-2 semanas',
        category: 'Consultoria'
      },
      {
        id: '4',
        name: 'Prototipagem Interativa',
        description: 'Criação de protótipos funcionais no Figma',
        price: 'R$ 70/hora',
        duration: '1 semana',
        category: 'Design'
      }
    ];
  };

  const getPortfolioItems = () => {
    return [
      {
        id: '1',
        title: 'App de Delivery - FoodExpress',
        description: 'Design completo de aplicativo de delivery com interface moderna',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        tags: ['Mobile', 'UI/UX', 'Figma']
      },
      {
        id: '2',
        title: 'Dashboard Analytics - DataViz',
        description: 'Interface de dashboard para análise de dados empresariais',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        tags: ['Web', 'Dashboard', 'React']
      },
      {
        id: '3',
        title: 'E-commerce - TechStore',
        description: 'Desenvolvimento completo de loja virtual responsiva',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
        tags: ['E-commerce', 'Next.js', 'Frontend']
      },
      {
        id: '4',
        title: 'Landing Page - StartupTech',
        description: 'Página de conversão para startup de tecnologia',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        tags: ['Landing Page', 'Conversion', 'Marketing']
      }
    ];
  };

  const getReviews = () => {
    return [
      {
        id: '1',
        client_name: 'Maria Fernanda',
        client_avatar: 'https://ui-avatars.com/api/?name=Maria+Fernanda&background=random',
        rating: 5,
        comment: 'Excelente profissional! Entregou o projeto no prazo e com qualidade excepcional. Super recomendo!',
        service: 'Design de Interface',
        date: '2024-01-15',
        verified: true
      },
      {
        id: '2',
        client_name: 'Carlos Eduardo',
        client_avatar: 'https://ui-avatars.com/api/?name=Carlos+Eduardo&background=random',
        rating: 5,
        comment: 'Trabalho impecável! O João entendeu perfeitamente nossas necessidades e criou uma solução incrível.',
        service: 'Desenvolvimento Frontend',
        date: '2024-01-10',
        verified: true
      },
      {
        id: '3',
        client_name: 'Ana Beatriz',
        client_avatar: 'https://ui-avatars.com/api/?name=Ana+Beatriz&background=random',
        rating: 4,
        comment: 'Muito profissional e atencioso. O resultado final ficou ótimo, apenas alguns pequenos ajustes necessários.',
        service: 'Consultoria em UX',
        date: '2024-01-05',
        verified: true
      }
    ];
  };

  const getProfessionalStats = () => {
    return {
      completedProjects: 89,
      responseTime: '2h',
      onTimeDelivery: '98%',
      clientSatisfaction: '4.8/5'
    };
  };

  if (loading) {
    return <ProfessionalSkeleton />;
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profissional não encontrado
          </h1>
          <p className="text-gray-600 mb-4">
            O profissional que você está procurando não existe ou foi removido.
          </p>
          <Link href="/profissionais">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Profissionais
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const services = getServicesForProfessional(professional.id);
  const portfolio = getPortfolioItems();
  const reviews = getReviews();
  const stats = getProfessionalStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/profissionais">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={isFavorited ? 'text-red-500' : ''}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Favoritado' : 'Favoritar'}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
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
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 mx-auto">
                      <Image
                        src={professional.avatar_url || getAvatarUrl(professional.name)}
                        alt={professional.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    {professional.rating >= 4.5 && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          <Award className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {professional.name}
                    </h1>
                    <p className="text-blue-600 font-medium">
                      {professional.specialties?.[0] || 'Profissional Especialista'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {professional.rating}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      ({professional.total_reviews} avaliações)
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{professional.address_city}, {professional.address_state}</span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Clock className="w-4 h-4" />
                    <span>Disponível</span>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {professional.hourly_rate}/hora
                    </p>
                    <p className="text-sm text-gray-500">
                      {professional.experience_years} anos de experiência
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <Button className="w-full" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Reunião
                  </Button>
                </div>

                {/* Contato */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contato
                  </h3>
                  {professional.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{formatPhone(professional.phone)}</span>
                    </div>
                  )}
                  {professional.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{professional.email}</span>
                    </div>
                  )}
                  {professional.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      <Link href={`https://${professional.website}`} className="text-blue-600 hover:underline">
                        {professional.website}
                      </Link>
                    </div>
                  )}
                  {professional.instagram && (
                    <div className="flex items-center gap-2 text-sm">
                      <Instagram className="w-4 h-4 text-gray-400" />
                      <Link href={`https://instagram.com/${professional.instagram.replace('@', '')}`} className="text-blue-600 hover:underline">
                        {professional.instagram}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Estatísticas */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.completedProjects}</div>
                      <div className="text-xs text-gray-500">Projetos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.responseTime}</div>
                      <div className="text-xs text-gray-500">Resposta</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{stats.onTimeDelivery}</div>
                      <div className="text-xs text-gray-500">No Prazo</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{stats.clientSatisfaction}</div>
                      <div className="text-xs text-gray-500">Satisfação</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Sobre {professional.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {professional.bio}
                </p>
                
                {professional.specialties && professional.specialties.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {professional.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {professional.certifications && professional.certifications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Certificações
                    </h4>
                    <ul className="space-y-1">
                      {professional.certifications.map((cert, index) => (
                        <li key={index} className="text-gray-600 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {professional.languages && professional.languages.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Idiomas</h4>
                    <div className="flex flex-wrap gap-2">
                      {professional.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="services" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>

              {/* Serviços */}
              <TabsContent value="services">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Serviços Oferecidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <Badge variant="outline">{service.category}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-blue-600">{service.price}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                {service.duration}
                              </div>
                            </div>
                            <Button size="sm">
                              Contratar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Portfólio */}
              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Portfólio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {portfolio.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-48">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
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
                      Avaliações ({professional.total_reviews})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
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
                                {review.verified && (
                                  <Badge className="bg-green-100 text-green-800 border-green-300">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verificado
                                  </Badge>
                                )}
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