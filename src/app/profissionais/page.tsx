'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Search, Star, Briefcase, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useRef } from 'react';

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

const profissionaisData = [
  {
    id: 1,
    nome: 'João Silva',
    profissao: 'Eletricista',
    descricao: 'Especialista em instalações elétricas residenciais e comerciais',
    imagem: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=60',
    categoria: 'eletricistas',
    categoriaMain: 'servicos-gerais',
    precoHora: 'R$ 80',
    rating: 4.9,
    reviews: 203,
    tempoMedioAtendimento: '1-2 horas',
    distancia: '3.2 km',
    profissionalVerificado: true,
    servicosDestaque: ['Instalação', 'Manutenção', 'Reparos']
  },
  {
    id: 2,
    nome: 'Maria Santos',
    profissao: 'Diarista',
    descricao: 'Limpeza residencial e comercial com produtos especializados',
    imagem: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=60',
    categoria: 'diaristas',
    categoriaMain: 'servicos-gerais',
    precoHora: 'R$ 35',
    rating: 4.8,
    reviews: 156,
    tempoMedioAtendimento: '4-6 horas',
    distancia: '1.5 km',
    profissionalVerificado: true,
    servicosDestaque: ['Limpeza Geral', 'Passadoria', 'Organização']
  },
  {
    id: 3,
    nome: 'Carlos Oliveira',
    profissao: 'Personal Trainer',
    descricao: 'Treinos personalizados para seus objetivos específicos',
    imagem: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop&q=60',
    categoria: 'personal-trainers',
    categoriaMain: 'saude',
    precoHora: 'R$ 120',
    rating: 5.0,
    reviews: 89,
    tempoMedioAtendimento: '1 hora',
    distancia: '2.8 km',
    profissionalVerificado: true,
    servicosDestaque: ['Musculação', 'Funcional', 'Aeróbico'],
    destaque: 'Primeira aula grátis'
  },
  {
    id: 4,
    nome: 'Ana Pereira',
    profissao: 'Cabeleireira',
    descricao: 'Especialista em cortes modernos e coloração',
    imagem: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&auto=format&fit=crop&q=60',
    categoria: 'cabeleireiros',
    categoriaMain: 'beleza',
    precoHora: 'Sob consulta',
    rating: 4.7,
    reviews: 245,
    tempoMedioAtendimento: 'Agenda para consulta',
    distancia: '4.1 km',
    profissionalVerificado: true,
    servicosDestaque: ['Corte', 'Coloração', 'Tratamentos'],
    destaque: '20% OFF primeira visita'
  },
  {
    id: 5,
    nome: 'Pedro Costa',
    profissao: 'Desenvolvedor Web',
    descricao: 'Desenvolvimento de sites e aplicações web responsivas',
    imagem: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60',
    categoria: 'desenvolvedores-sites',
    categoriaMain: 'design',
    precoHora: 'R$ 150',
    rating: 4.9,
    reviews: 67,
    tempoMedioAtendimento: 'Projeto sob demanda',
    distancia: '5.0 km',
    profissionalVerificado: true,
    servicosDestaque: ['Sites', 'E-commerce', 'Landing Pages'],
    orcamento: 'Orçamento personalizado'
  }
];

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

// Componente que carrega os dados dos profissionais
function ProfissionaisList({ categoria }: { categoria: string }) {
  const [profissionais, setProfissionais] = React.useState(profissionaisData);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simula o carregamento dos dados
    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = categoria === 'todos' 
        ? profissionaisData
        : profissionaisData.filter(p => p.profissao.toLowerCase() === categoria.slice(0, -1).toLowerCase());
      setProfissionais(filtered);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [categoria]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <ProfissionalCardSkeleton key={i} />
        ))}
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
            {profissional.destaque && (
              <div 
                className="absolute top-3 left-0 bg-red-600 text-white text-xs py-1 px-3 z-10"
                role="status"
                aria-label={`Profissional em destaque: ${profissional.destaque}`}
              >
                {profissional.destaque}
              </div>
            )}
            <div className="p-4 flex items-center gap-4">
              <div 
                className="relative w-24 h-24 rounded-full overflow-hidden"
                role="img"
                aria-label={`Foto de perfil de ${profissional.nome}`}
              >
                <Image
                  src={profissional.imagem}
                  alt={`Foto de ${profissional.nome}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                  className="object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {profissional.nome}
                  {profissional.profissionalVerificado && (
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
                  )}
                </h3>
                <p className="text-sm text-gray-600">{profissional.profissao}</p>
                <div 
                  className="flex items-center mt-1"
                  role="group"
                  aria-label={`Avaliação: ${profissional.rating} de 5 estrelas, ${profissional.reviews} avaliações`}
                >
                  <Star size={14} className="text-yellow-500 fill-current" aria-hidden="true" />
                  <span className="text-sm ml-1">{profissional.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({profissional.reviews})</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações */}
          <div className="p-4 border-t">
            <div 
              className="flex items-center text-sm text-gray-500 mb-2"
              role="group"
              aria-label={`Experiência: ${profissional.tempoMedioAtendimento}`}
            >
              <Clock size={14} className="mr-1" aria-hidden="true" />
              <span>{profissional.tempoMedioAtendimento}</span>
            </div>
            <div 
              className="flex items-center text-sm text-gray-500 mb-2"
              role="group"
              aria-label={`Localização: ${profissional.distancia} de distância`}
            >
              <MapPin size={14} className="mr-1" aria-hidden="true" />
              <span>{profissional.distancia}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p 
                  className="font-medium"
                  role="text"
                  aria-label={`Valor: ${profissional.precoHora}${profissional.precoHora !== 'Sob consulta' ? ' por hora' : ''}`}
                >
                  {profissional.precoHora}
                  {profissional.precoHora !== 'Sob consulta' && <span className="text-sm text-gray-500">/hora</span>}
                </p>
                <p 
                  className="text-sm text-green-600"
                  role="status"
                  aria-label={`Status: ${profissional.profissionalVerificado ? 'Disponível' : 'Indisponível'}`}
                >
                  {profissional.profissionalVerificado ? 'Disponível' : 'Indisponível'}
                </p>
              </div>
              <Button 
                className="bg-ifood-red hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Contratar ${profissional.nome}`}
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
  const categoriasContainerRef = useRef<HTMLDivElement>(null);

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

  const profissionaisFiltrados = profissionaisData.filter(profissional => {
    const matchesCategoria = categoriaAtiva === 'todos' || profissional.categoriaMain === categoriaAtiva;
    const matchesSubcategoria = subcategoriaAtiva === 'todas' || profissional.categoria === subcategoriaAtiva;
    const matchesSearch = searchTerm === '' || 
      profissional.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.profissao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.servicosDestaque.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategoria && matchesSubcategoria && matchesSearch;
  });

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
                    
                    {/* Dropdown de Subcategorias (aparece no hover) */}
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
        <h1 className="text-2xl font-bold mb-4">Profissionais em sua região</h1>
        
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
        
        {/* Lista de Profissionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profissionaisFiltrados.map((profissional, index) => (
            <Link 
              key={profissional.id} 
              href={`/profissionais/${profissional.id}/perfil`}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-primary/20">
                {/* Container da Imagem */}
                <div className="relative h-48">
                  {profissional.destaque && (
                    <div className="absolute top-3 left-0 bg-red-600 text-white text-xs py-1 px-3 z-10">
                      {profissional.destaque}
                    </div>
                  )}
                  <Image
                    src={profissional.imagem}
                    alt={profissional.nome}
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
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{profissional.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {profissional.profissao}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm ml-1">{profissional.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({profissional.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{profissional.descricao}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {profissional.servicosDestaque.map((servico, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {servico}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{profissional.tempoMedioAtendimento}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{profissional.distancia}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-primary">
                        {profissional.precoHora}
                        {profissional.precoHora !== 'Sob consulta' && <span className="text-sm text-gray-500">/hora</span>}
                      </p>
                      {profissional.orcamento && (
                        <p className="text-xs text-gray-500">{profissional.orcamento}</p>
                      )}
                    </div>
                    {profissional.profissionalVerificado && (
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                        Profissional verificado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 