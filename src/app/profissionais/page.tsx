'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Search, Star, Briefcase, ChevronDown, ChevronLeft, ChevronRight, Crown, Badge as BadgeIcon, Phone, Mail, Award, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { useProfessionals } from '@/hooks/api/useProfessionals';
import { ProfessionalFilters } from '@/components/filters/ProfessionalFilters';
import { createClient } from '@/lib/supabase/client';

// Dados do profissional patrocinado
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
    state: 'PR'
  },
  specialties: ['Contabilidade', 'Fiscal', 'Societário', 'Paralegal'],
  description: 'CEO da Contratto com 2 anos de experiência em contabilidade. Especialista em serviços fiscais, societários e paralegal, oferecendo soluções completas para empresas e profissionais autônomos.',
  image: '/matheus-celso.png',
  rating: 4.9,
  reviews: 47,
  isSponsored: true,
  verified: true,
  available: true,
  responseTime: '< 2 horas'
};

const categorias = [
  {
    id: 'servicos-gerais',
    nome: 'Serviços Gerais & Manutenção',
    subcategorias: [
      { id: 'eletricistas', nome: 'Eletricistas' },
      { id: 'encanadores', nome: 'Encanadores' },
      { id: 'diaristas', nome: 'Diaristas & Faxineiras' },
      { id: 'pintores', nome: 'Pintores' },
      { id: 'pedreiros', nome: 'Pedreiros & Serventes' },
      { id: 'azulejistas', nome: 'Azulejistas & Gesseiros' },
      { id: 'jardineiros', nome: 'Jardineiros & Paisagistas' },
      { id: 'marceneiros', nome: 'Marceneiros & Carpinteiros' },
      { id: 'vidraceiros', nome: 'Vidraceiros' },
      { id: 'serralheiros', nome: 'Serralheiros' },
      { id: 'bombeiros', nome: 'Bombeiros Hidráulicos' }
    ]
  },
  {
    id: 'instalacoes',
    nome: 'Instalações & Técnicos',
    subcategorias: [
      { id: 'ar-condicionado', nome: 'Técnicos em Ar-condicionado' },
      { id: 'refrigeracao', nome: 'Técnicos em Refrigeração' },
      { id: 'informatica', nome: 'Técnicos em Informática' },
      { id: 'seguranca', nome: 'Técnicos em Segurança Eletrônica' },
      { id: 'solar', nome: 'Instaladores de Painéis Solares' },
      { id: 'antenas', nome: 'Instaladores de Antenas & Redes' }
    ]
  },
  {
    id: 'contabilidade',
    nome: 'Contabilidade & Finanças',
    subcategorias: [
      { id: 'contadores', nome: 'Contadores' },
      { id: 'consultores-fiscais', nome: 'Consultores Fiscais' },
      { id: 'advogados-tributarios', nome: 'Advogados Tributários' },
      { id: 'paralegal', nome: 'Serviços Paralegal' },
      { id: 'societario', nome: 'Consultoria Societária' }
    ]
  },
  {
    id: 'beleza',
    nome: 'Beleza, Moda & Bem-estar',
    subcategorias: [
      { id: 'cabeleireiros', nome: 'Cabeleireiros & Barbeiros' },
      { id: 'maquiadores', nome: 'Maquiadores' },
      { id: 'esteticistas', nome: 'Esteticistas' },
      { id: 'manicures', nome: 'Manicures & Pedicures' },
      { id: 'massoterapeutas', nome: 'Massoterapeutas' },
      { id: 'personal-stylists', nome: 'Personal Stylists' }
    ]
  },
  {
    id: 'saude',
    nome: 'Saúde & Terapias',
    subcategorias: [
      { id: 'psicologos', nome: 'Psicólogos' },
      { id: 'fisioterapeutas', nome: 'Fisioterapeutas' },
      { id: 'nutricionistas', nome: 'Nutricionistas' },
      { id: 'terapeutas', nome: 'Terapeutas Ocupacionais' },
      { id: 'acupunturistas', nome: 'Acupunturistas' },
      { id: 'enfermeiros', nome: 'Enfermeiros & Cuidadores' },
      { id: 'personal-trainers', nome: 'Personal Trainers' }
    ]
  },
  {
    id: 'educacao',
    nome: 'Educação & Aulas',
    subcategorias: [
      { id: 'professores', nome: 'Professores Particulares' },
      { id: 'idiomas', nome: 'Instrutores de Idiomas' },
      { id: 'concursos', nome: 'Tutores para Concursos/ENEM' },
      { id: 'musica', nome: 'Aulas de Música' },
      { id: 'danca', nome: 'Aulas de Dança' },
      { id: 'mentores', nome: 'Mentores Profissionais' }
    ]
  },
  {
    id: 'design',
    nome: 'Design & Tecnologia',
    subcategorias: [
      { id: 'designers', nome: 'Designers Gráficos' },
      { id: 'web-designers', nome: 'Web Designers' },
      { id: 'desenvolvedores-sites', nome: 'Desenvolvedores de Sites' },
      { id: 'desenvolvedores-apps', nome: 'Desenvolvedores de Apps' },
      { id: 'fotografos', nome: 'Fotógrafos & Videomakers' },
      { id: 'marketing', nome: 'Especialistas em Marketing Digital' },
      { id: 'social-media', nome: 'Social Media' }
    ]
  },
  {
    id: 'automotivos',
    nome: 'Serviços Automotivos',
    subcategorias: [
      { id: 'mecanicos', nome: 'Mecânicos' },
      { id: 'funileiros', nome: 'Funileiros & Pintores Automotivos' },
      { id: 'eletricistas-auto', nome: 'Eletricistas de Autos' },
      { id: 'instaladores-som', nome: 'Instaladores de Som & Acessórios' },
      { id: 'lavadores', nome: 'Lavadores & Estética Automotiva' }
    ]
  },
  {
    id: 'eventos',
    nome: 'Eventos & Produção',
    subcategorias: [
      { id: 'djs', nome: 'DJs & Músicos' },
      { id: 'bartenders', nome: 'Bartenders' },
      { id: 'cerimonialistas', nome: 'Cerimonialistas' },
      { id: 'decoradores', nome: 'Decoradores de Eventos' },
      { id: 'chefs', nome: 'Cozinheiros & Chefs' },
      { id: 'fotografos-eventos', nome: 'Fotógrafos de Eventos' },
      { id: 'animadores', nome: 'Animadores & Recreadores' }
    ]
  },
  {
    id: 'pets',
    nome: 'Serviços para Pets',
    subcategorias: [
      { id: 'dog-walkers', nome: 'Dog Walkers' },
      { id: 'banho-tosa', nome: 'Banho & Tosa' },
      { id: 'adestradores', nome: 'Adestradores' },
      { id: 'pet-sitters', nome: 'Pet Sitters' },
      { id: 'veterinarios', nome: 'Veterinários Autônomos' }
    ]
  }
];

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  status: string;
  created_at: string;
  total_reviews: number;
  average_rating: number;
}

// Componente de Loading para os cards
function ProfissionalCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Componente do Perfil Patrocinado
function ProfilePatrocinado() {
  const formatPhone = (phone: string) => {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <Link href="/profissionais/matheus-celso" className="block">
      <Card className="relative overflow-hidden mb-8 border-2 border-gradient-to-r from-yellow-400 to-yellow-600 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
        {/* Badge de Patrocinado */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
            <Crown className="w-3 h-3 mr-1" />
            PATROCINADO
          </Badge>
        </div>

        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-600/10 pointer-events-none group-hover:from-yellow-400/20 group-hover:to-yellow-600/20 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Foto e Informações Básicas */}
            <div className="flex flex-col md:flex-row gap-4 lg:flex-col lg:w-1/3">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 relative mx-auto lg:mx-0">
                  <Image
                    src={matheusProfile.image}
                    alt={matheusProfile.name}
                    fill
                    className="rounded-full object-cover border-4 border-yellow-400 group-hover:border-yellow-500 transition-all duration-300"
                    priority
                  />
                  {matheusProfile.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                  <h2 className="text-2xl font-bold group-hover:text-yellow-700 transition-colors duration-300">{matheusProfile.name}</h2>
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-lg text-gray-600 mb-1">{matheusProfile.position} • {matheusProfile.company}</p>
                <p className="text-sm text-gray-500 mb-3">{matheusProfile.age} anos • {matheusProfile.experience} de experiência</p>
                
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium ml-1">{matheusProfile.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({matheusProfile.reviews} avaliações)</span>
                  </div>
                </div>

                {matheusProfile.available && (
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Disponível agora</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informações Detalhadas */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Sobre o Profissional</h3>
                <p className="text-gray-600 leading-relaxed">{matheusProfile.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Especialidades</h4>
                <div className="flex flex-wrap gap-2">
                  {matheusProfile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Localização</h4>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                      {matheusProfile.address.street}, {matheusProfile.address.number}<br />
                      {matheusProfile.address.neighborhood}, {matheusProfile.address.city} - {matheusProfile.address.state}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Contato</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{formatPhone(matheusProfile.phone)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="break-all">{matheusProfile.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Responde em {matheusProfile.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>Profissional Verificado</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(`tel:${matheusProfile.phone}`, '_self');
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(`mailto:${matheusProfile.email}`, '_self');
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contratar Agora
                  </Button>
                </div>
              </div>

              {/* Indicador de clique */}
              <div className="text-center mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  👆 Clique para ver o perfil completo
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Componente que carrega os dados dos profissionais
function ProfissionaisList({ categoria }: { categoria: string }) {
  const { data: profissionaisData, isLoading, error } = useProfessionals({
    specialty: categoria !== 'todos' ? categoria : undefined,
    limit: 12
  });

  const profissionais = profissionaisData?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <ProfissionalCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Erro ao carregar profissionais</h3>
          <p>Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  if (profissionais.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Nenhum profissional encontrado</h3>
          <p>Tente ajustar os filtros ou buscar por outra categoria.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="region"
      aria-label="Lista de profissionais"
    >
      {profissionais.map((profissional, index) => (
        <div 
          key={profissional.id} 
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        >
          {/* Cabeçalho com Foto e Badge */}
          <div className="relative">
            <div className="p-4 flex items-center gap-4">
              <div 
                className="relative w-24 h-24 rounded-full overflow-hidden"
                role="img"
                aria-label={`Foto de perfil de ${profissional.name}`}
              >
                <Image
                  src={profissional.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60'}
                  alt={`Foto de ${profissional.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                  className="object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {profissional.name}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="#ea1d2c" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    role="img"
                    aria-label="Profissional verificado"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </h3>
                <p className="text-sm text-gray-600">{profissional.specialties?.[0] || 'Profissional'}</p>
                <div 
                  className="flex items-center mt-1"
                  role="group"
                  aria-label={`Avaliação: ${profissional.stats.averageRating} de 5 estrelas, ${profissional.stats.totalReviews} avaliações`}
                >
                  <Star size={14} className="text-yellow-500 fill-current" aria-hidden="true" />
                  <span className="text-sm ml-1">{profissional.stats.averageRating || 0}</span>
                  <span className="text-sm text-gray-500 ml-1">({profissional.stats.totalReviews || 0})</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações */}
          <div className="p-4 border-t">
            <div 
              className="flex items-center text-sm text-gray-500 mb-2"
              role="group"
              aria-label="Disponibilidade"
            >
              <Clock size={14} className="mr-1" aria-hidden="true" />
              <span>Disponível</span>
            </div>
            <div 
              className="flex items-center text-sm text-gray-500 mb-2"
              role="group"
              aria-label={`Localização: ${profissional.location}`}
            >
              <MapPin size={14} className="mr-1" aria-hidden="true" />
              <span>{typeof profissional.location === 'string' ? profissional.location : 'Localização não informada'}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p 
                  className="font-medium"
                  role="text"
                  aria-label="Valor sob consulta"
                >
                  Sob consulta
                </p>
                <p 
                  className="text-sm text-green-600"
                  role="status"
                  aria-label="Status: Disponível"
                >
                  Disponível
                </p>
              </div>
              <Button 
                className="bg-ifood-red hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Contratar ${profissional.name}`}
              >
                Contratar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfissionaisPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState('todas');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const categoriasContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select(`
          id,
          name,
          email,
          phone,
          specialties,
          status,
          created_at
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar profissionais:', error);
        return;
      }

      // Buscar estatísticas de avaliações para cada profissional
      const professionalsWithStats = await Promise.all(
        (data || []).map(async (professional) => {
          const { data: reviews } = await supabase
            .from('professional_reviews')
            .select('rating')
            .eq('professional_id', professional.id);

          const total_reviews = reviews?.length || 0;
          const average_rating = total_reviews > 0 && reviews
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / total_reviews 
            : 0;

          return {
            ...professional,
            total_reviews,
            average_rating: Math.round(average_rating * 10) / 10
          };
        })
      );

      setProfissionais(professionalsWithStats);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriasContainerRef.current) {
      const scrollAmount = 300;
      const container = categoriasContainerRef.current;
      const newScrollPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoriaClick = (categoriaId: string) => {
    if (categoriaId === categoriaAtiva) {
      setCategoriaAtiva('todos');
      setSubcategoriaAtiva('todas');
    } else {
      setCategoriaAtiva(categoriaId);
      setSubcategoriaAtiva('todas');
    }
  };

  const handleSubcategoriaClick = (subcategoriaId: string) => {
    setSubcategoriaAtiva(subcategoriaId === subcategoriaAtiva ? 'todas' : subcategoriaId);
  };

  // Mapear especialidades do banco para as categorias da UI
  const mapSpecialtyToCategory = (specialties: string[]) => {
    const specialtyMap: { [key: string]: { main: string; sub: string } } = {
      // Serviços Gerais
      'instalação elétrica': { main: 'servicos-gerais', sub: 'eletricistas' },
      'manutenção preventiva': { main: 'servicos-gerais', sub: 'eletricistas' },
      'automação': { main: 'servicos-gerais', sub: 'eletricistas' },
      'pintura residencial': { main: 'servicos-gerais', sub: 'pintores' },
      'pintura comercial': { main: 'servicos-gerais', sub: 'pintores' },
      'pintura industrial': { main: 'servicos-gerais', sub: 'pintores' },
      'textura': { main: 'servicos-gerais', sub: 'pintores' },
      'grafiato': { main: 'servicos-gerais', sub: 'pintores' },
      'jardinagem': { main: 'servicos-gerais', sub: 'jardineiros' },
      'paisagismo': { main: 'servicos-gerais', sub: 'jardineiros' },
      'poda': { main: 'servicos-gerais', sub: 'jardineiros' },
      'irrigação': { main: 'servicos-gerais', sub: 'jardineiros' },
      'limpeza residencial': { main: 'servicos-gerais', sub: 'diaristas' },
      'limpeza pós-obra': { main: 'servicos-gerais', sub: 'diaristas' },
      'organização': { main: 'servicos-gerais', sub: 'diaristas' },
      'pedreiro': { main: 'servicos-gerais', sub: 'pedreiros' },
      'azulejista': { main: 'servicos-gerais', sub: 'azulejistas' },
      'gesseiro': { main: 'servicos-gerais', sub: 'azulejistas' },
      
      // Técnicos
      'manutenção de pc': { main: 'instalacoes', sub: 'informatica' },
      'instalação de redes': { main: 'instalacoes', sub: 'informatica' },
      'suporte técnico': { main: 'instalacoes', sub: 'informatica' },
      
      // Saúde
      'terapia individual': { main: 'saude', sub: 'psicologos' },
      'terapia de casal': { main: 'saude', sub: 'psicologos' },
      'psicologia infantil': { main: 'saude', sub: 'psicologos' },
      'musculação': { main: 'saude', sub: 'personal-trainers' },
      'funcional': { main: 'saude', sub: 'personal-trainers' },
      'crossfit': { main: 'saude', sub: 'personal-trainers' },
      'nutrição esportiva': { main: 'saude', sub: 'nutricionistas' },
      'emagrecimento': { main: 'saude', sub: 'nutricionistas' },
      'reeducação alimentar': { main: 'saude', sub: 'nutricionistas' },
      'fisioterapia ortopédica': { main: 'saude', sub: 'fisioterapeutas' },
      'rpg': { main: 'saude', sub: 'fisioterapeutas' },
      'pilates': { main: 'saude', sub: 'fisioterapeutas' },
      
      // Beleza
      'corte feminino': { main: 'beleza', sub: 'cabeleireiros' },
      'coloração': { main: 'beleza', sub: 'cabeleireiros' },
      'escova': { main: 'beleza', sub: 'cabeleireiros' },
      'manicure': { main: 'beleza', sub: 'manicures' },
      'pedicure': { main: 'beleza', sub: 'manicures' },
      'nail art': { main: 'beleza', sub: 'manicures' },
      
      // Automotivos
      'mecânica geral': { main: 'automotivos', sub: 'mecanicos' },
      'elétrica automotiva': { main: 'automotivos', sub: 'eletricistas-auto' },
      'injeção eletrônica': { main: 'automotivos', sub: 'mecanicos' },
    };

    for (const specialty of specialties) {
      const mapped = specialtyMap[specialty.toLowerCase()];
      if (mapped) return mapped;
    }
    
    return { main: 'servicos-gerais', sub: 'outros' };
  };

  // Filtrar profissionais
  const profissionaisFiltrados = profissionais.filter(professional => {
    const mapped = mapSpecialtyToCategory(professional.specialties);
    const matchesCategoria = categoriaAtiva === 'todos' || mapped.main === categoriaAtiva;
    const matchesSubcategoria = subcategoriaAtiva === 'todas' || mapped.sub === subcategoriaAtiva;
    const matchesSearch = searchTerm === '' || 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesCategoria && matchesSubcategoria && matchesSearch;
  });

  // Função para gerar avatar baseado no nome
  const getAvatarUrl = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ea1d2c&color=fff&size=200&font-size=0.6`;
  };

  // Função para obter a primeira especialidade
  const getPrimarySpecialty = (specialties: string[]) => {
    return specialties[0] || 'Profissional';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de Categorias */}
      <div className="border-b sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4">
          <div className="relative">
            {/* Botão de navegação esquerda */}
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Container das categorias com ref */}
            <div 
              ref={categoriasContainerRef}
              className="flex overflow-x-auto scrollbar-hide py-4 -mb-px scroll-smooth"
            >
              <div className="flex space-x-1 min-w-full px-8">
                <button
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    categoriaAtiva === 'todos'
                      ? 'bg-red-500 text-white'
                      : 'hover:bg-red-50'
                  }`}
                  onClick={() => handleCategoriaClick('todos')}
                >
                  Todos os Profissionais
                </button>
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="relative group">
                    <button
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        categoriaAtiva === categoria.id
                          ? 'bg-red-500 text-white'
                          : 'hover:bg-red-50'
                      }`}
                      onClick={() => handleCategoriaClick(categoria.id)}
                    >
                      {categoria.nome}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown de Subcategorias */}
                    <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-2 min-w-[200px] z-20">
                      {categoria.subcategorias.map((sub) => (
                        <button
                          key={sub.id}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            subcategoriaAtiva === sub.id ? 'text-red-500 bg-red-50' : ''
                          }`}
                          onClick={() => handleSubcategoriaClick(sub.id)}
                        >
                          {sub.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de navegação direita */}
            <button
              onClick={() => scrollCategories('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Gradientes para indicar rolagem */}
            <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">
          Profissionais em sua região ({profissionaisFiltrados.length} profissionais encontrados)
        </h1>
        
        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="M3 6h18"></path><path d="M7 12h10"></path><path d="M11 18h4"></path></svg>
              Filtros
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              Ordenar
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="m21 8-4-4-4 4"></path><path d="M17 4v16"></path></svg>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              Distância
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="m6 9 6 6 6-6"></path></svg>
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar profissionais"
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Perfil Patrocinado */}
        <ProfilePatrocinado />
        
        {/* Lista de Profissionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profissionaisFiltrados.map((professional, index) => (
            <Link 
              key={professional.id} 
              href={`/profissionais/${professional.id}/perfil`}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-primary/20">
                {/* Container da Imagem */}
                <div className="relative h-48">
                  <Image
                    src={getAvatarUrl(professional.name)}
                    alt={professional.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={index < 3}
                  />
                </div>
                
                {/* Conteúdo */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{professional.name}</h3>
                      <p className="text-sm text-gray-600">
                        {getPrimarySpecialty(professional.specialties)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm ml-1">{professional.average_rating || 0}</span>
                      <span className="text-xs text-gray-500 ml-1">({professional.total_reviews})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {professional.specialties.slice(0, 3).map((specialty, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Disponível</span>
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>São Paulo, SP</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-primary">
                        Sob consulta
                      </p>
                      <p className="text-xs text-green-600">Disponível</p>
                    </div>
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                        Profissional verificado
                      </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {profissionaisFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Briefcase className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum profissional encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </div>
    </div>
  );
} 