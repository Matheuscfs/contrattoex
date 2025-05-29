'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Star, Building2, CheckCircle, Clock, Phone, Mail, Play, Check, Users, Zap, Shield, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Company {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  description?: string;
  logo_url?: string;
  address_city?: string;
  address_state?: string;
  contact_phone?: string;
  contact_email?: string;
  status: string;
  verified: boolean;
  created_at: string;
}

function CompanyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const getLogoUrl = (companyName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=1f2937&color=ffffff&size=200&format=svg`;
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const getCompanyAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    
    return years > 0 ? `${years} anos` : 'Menos de 1 ano';
  };

  return (
    <Link href={`/empresas/${company.id}/perfil`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-primary/20 group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="relative">
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-primary/30 transition-colors bg-gray-100">
                <Image
                  src={company.logo_url || getLogoUrl(company.nome_fantasia || company.razao_social)}
                  alt={company.nome_fantasia || company.razao_social}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              {company.verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            {/* Informações */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                    {company.nome_fantasia || company.razao_social}
                  </h3>
                  {company.nome_fantasia && (
                    <p className="text-sm text-gray-600 truncate">
                      {company.razao_social}
                    </p>
                  )}
                </div>
                <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                  {company.status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">CNPJ:</span> {formatCNPJ(company.cnpj)}
                </div>
                
                {company.address_city && company.address_state && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{company.address_city}, {company.address_state}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{getCompanyAge(company.created_at)} no mercado</span>
                </div>
              </div>
              
              {company.description && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                  {company.description}
                </p>
              )}
              
              {/* Contatos */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                {company.contact_phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Telefone</span>
                  </div>
                )}
                {company.contact_email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>E-mail</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      
      // Dados mockados incluindo a TK Reguladora
      const mockCompanies: Company[] = [
        {
          id: '61e4ba9a-c074-4920-9428-9a0dd2580f36',
          razao_social: 'TK REGULADORA E LOCACAO DE VEICULOS LTDA',
          nome_fantasia: 'TK REGULADORA',
          cnpj: '22089428000195',
          description: 'Empresa especializada em locação de automóveis sem condutor, regulação de sinistros e serviços automotivos.',
          logo_url: undefined,
          address_city: 'CASCAVEL',
          address_state: 'PR',
          contact_phone: '(45) 8822-4299',
          contact_email: 'supervisao@businessgestao.com.br',
          status: 'active',
          verified: true,
          created_at: '2015-03-20T00:00:00Z'
        }
      ];
      
      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    (company.nome_fantasia || company.razao_social)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    company.cnpj.includes(searchTerm.replace(/\D/g, '')) ||
    (company.address_city && company.address_city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const plans = [
    {
      name: 'Basic',
      price: 'R$ 0',
      period: 'por mês',
      description: 'Perfeito para começar',
      features: [
        'Até 5 serviços',
        'Perfil básico',
        'Suporte por email',
        'Listagem na plataforma'
      ],
      cta: 'Começar Grátis',
      popular: false
    },
    {
      name: 'Pro',
      price: 'R$ 49',
      period: 'por mês',
      description: 'Para empresas em crescimento',
      features: [
        'Serviços ilimitados',
        'Perfil destacado',
        'Suporte prioritário',
        'Analytics avançado',
        'Badge de verificação'
      ],
      cta: 'Escolher Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'R$ 99',
      period: 'por mês',
      description: 'Para grandes empresas',
      features: [
        'Tudo do plano Pro',
        'API personalizada',
        'Gerente dedicado',
        'Integração customizada',
        'Relatórios personalizados'
      ],
      cta: 'Falar com Vendas',
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Mais Clientes',
      description: 'Conecte-se com milhares de clientes em busca dos seus serviços'
    },
    {
      icon: Zap,
      title: 'Gestão Simplificada',
      description: 'Gerencie agendamentos, pagamentos e clientes em um só lugar'
    },
    {
      icon: Shield,
      title: 'Pagamentos Seguros',
      description: 'Receba seus pagamentos com segurança e rapidez'
    },
    {
      icon: Building2,
      title: 'Credibilidade',
      description: 'Tenha um perfil profissional que transmite confiança'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      company: 'Salão Beleza & Estilo',
      rating: 5,
      text: 'Desde que entrei na plataforma, meus agendamentos aumentaram 300%. Recomendo!'
    },
    {
      name: 'João Santos',
      company: 'AutoMec Cascavel',
      rating: 5,
      text: 'A gestão ficou muito mais fácil. Agora posso focar no que faço de melhor.'
    },
    {
      name: 'Ana Costa',
      company: 'Pet Care Premium',
      rating: 5,
      text: 'Excelente plataforma! Meus clientes adoram a facilidade de agendamento.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section com Vídeo */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Vídeo de Fundo */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/aperto-de-mao.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transforme Sua Empresa
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Conecte-se com milhares de clientes e faça seu negócio crescer na maior plataforma de serviços do Brasil
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/empresas/cadastro">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold">
                Cadastrar Empresa
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="mr-2 w-5 h-5" />
              Ver Como Funciona
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Cadastro gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Sem taxa de adesão</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Suporte especializado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher o Contratto?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mais de 10.000 empresas já confiam na nossa plataforma para crescer seus negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Escolha o plano ideal</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comece gratuitamente e evolua conforme seu negócio cresce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-8 ${plan.popular ? 'border-primary border-2 shadow-xl scale-105' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/empresas/cadastro">
                    <Button 
                      className={`w-full py-3 ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-900 hover:bg-gray-800'}`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que nossos parceiros dizem</h2>
            <p className="text-xl text-gray-600">
              Histórias reais de empresas que transformaram seus negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para fazer seu negócio decolar?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já estão crescendo com o Contratto
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/empresas/cadastro">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Começar Agora - É Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Phone className="mr-2 w-5 h-5" />
                (45) 3220-7890
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <MessageCircle className="mr-2 w-5 h-5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 