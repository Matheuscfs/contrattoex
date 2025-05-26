'use client'

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Search, Star, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef } from 'react';

const categorias = [
  {
    id: 'servicos-empresariais',
    nome: 'Serviços Empresariais',
    subcategorias: [
      { id: 'contabilidade', nome: 'Contabilidade & Fiscal' },
      { id: 'consultoria', nome: 'Consultoria Empresarial' },
      { id: 'juridico', nome: 'Jurídico & Advocacia' },
      { id: 'rh', nome: 'Recursos Humanos & Recrutamento' },
      { id: 'traducao', nome: 'Serviços de Tradução' },
      { id: 'financeiro', nome: 'Gestão Financeira & Controladoria' }
    ]
  },
  {
    id: 'marketing',
    nome: 'Marketing & Comunicação',
    subcategorias: [
      { id: 'marketing-digital', nome: 'Marketing Digital' },
      { id: 'publicidade', nome: 'Publicidade & Propaganda' },
      { id: 'redes-sociais', nome: 'Gestão de Redes Sociais' },
      { id: 'producao', nome: 'Produção de Vídeo & Fotografia' },
      { id: 'branding', nome: 'Branding & Identidade Visual' }
    ]
  },
  {
    id: 'tecnologia',
    nome: 'Tecnologia & Desenvolvimento',
    subcategorias: [
      { id: 'desenvolvimento', nome: 'Desenvolvimento de Sites & Aplicativos' },
      { id: 'suporte-ti', nome: 'Suporte de TI & Infraestrutura' },
      { id: 'automacao', nome: 'Automação & Robótica' },
      { id: 'seguranca', nome: 'Segurança da Informação' },
      { id: 'cloud', nome: 'Cloud & DevOps' }
    ]
  },
  {
    id: 'logistica',
    nome: 'Logística & Transporte',
    subcategorias: [
      { id: 'cargas', nome: 'Transporte de Cargas' },
      { id: 'motofrete', nome: 'Motofrete & Entregas Urbanas' },
      { id: 'armazenagem', nome: 'Armazenagem & Logística' },
      { id: 'mudancas', nome: 'Mudanças Comerciais' }
    ]
  },
  {
    id: 'treinamento',
    nome: 'Treinamento & Educação Corporativa',
    subcategorias: [
      { id: 'cursos', nome: 'Cursos Profissionalizantes' },
      { id: 'treinamentos', nome: 'Treinamentos Técnicos' },
      { id: 'coaching', nome: 'Coaching & Mentoria' },
      { id: 'palestras', nome: 'Palestras & Workshops' }
    ]
  },
  {
    id: 'engenharia',
    nome: 'Engenharia & Arquitetura',
    subcategorias: [
      { id: 'arquitetura', nome: 'Projetos Arquitetônicos' },
      { id: 'engenharia-civil', nome: 'Engenharia Civil & Elétrica' },
      { id: 'laudos', nome: 'Laudos Técnicos & Vistorias' },
      { id: 'topografia', nome: 'Geoprocessamento & Topografia' }
    ]
  },
  {
    id: 'ambiental',
    nome: 'Serviços Ambientais',
    subcategorias: [
      { id: 'licenciamento', nome: 'Licenciamento Ambiental' },
      { id: 'residuos', nome: 'Gestão de Resíduos' },
      { id: 'sustentabilidade', nome: 'Consultoria em Sustentabilidade' },
      { id: 'energia', nome: 'Energia Solar & Eficientização' }
    ]
  },
  {
    id: 'manutencao',
    nome: 'Manutenção & Instalações Comerciais',
    subcategorias: [
      { id: 'eletrica', nome: 'Elétrica & Hidráulica' },
      { id: 'climatizacao', nome: 'Ar-condicionado & Climatização' },
      { id: 'seguranca', nome: 'CFTV & Segurança Eletrônica' },
      { id: 'limpeza', nome: 'Limpeza Técnica & Predial' }
    ]
  },
  {
    id: 'eventos',
    nome: 'Eventos Corporativos',
    subcategorias: [
      { id: 'organizacao', nome: 'Organização de Eventos' },
      { id: 'locacao', nome: 'Locação de Equipamentos' },
      { id: 'buffet', nome: 'Buffet & Coffee Break' },
      { id: 'cerimonial', nome: 'Cerimonial & Protocolo' }
    ]
  },
  {
    id: 'industria',
    nome: 'Serviços para Indústrias',
    subcategorias: [
      { id: 'manutencao-industrial', nome: 'Manutenção Industrial' },
      { id: 'automacao-processos', nome: 'Automação de Processos' },
      { id: 'nr', nome: 'Treinamentos NR' },
      { id: 'qualidade', nome: 'Consultoria de Qualidade (ISO, Lean, etc.)' }
    ]
  },
  {
    id: 'saude',
    nome: 'Serviços de Saúde e Bem-Estar',
    subcategorias: [
      { id: 'clinicas', nome: 'Clínicas Médicas & Odontológicas' },
      { id: 'psicologia', nome: 'Psicologia & Terapias' },
      { id: 'fisioterapia', nome: 'Fisioterapia & Reabilitação' },
      { id: 'nutricao', nome: 'Nutrição & Estética Avançada' }
    ]
  }
];

const servicosData = [
  {
    id: 1,
    nome: 'Eletrotec Instalações',
    descricao: 'Empresa especializada em instalações e manutenções elétricas residenciais e comerciais',
    imagem: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
    categoria: 'eletrica',
    categoriaMain: 'manutencao',
    precoHora: 'R$ 120',
    rating: 4.8,
    reviews: 156,
    tempoMedioAtendimento: '1-2 horas',
    distancia: '2.5 km',
    empresaParceira: true,
    servicosDestaque: ['Instalação', 'Manutenção', 'Projetos']
  },
  {
    id: 2,
    nome: 'Hidro Service',
    descricao: 'Soluções completas em serviços hidráulicos com atendimento 24 horas',
    imagem: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
    categoria: 'eletrica',
    categoriaMain: 'manutencao',
    precoHora: 'R$ 100',
    rating: 4.7,
    reviews: 143,
    tempoMedioAtendimento: '1-3 horas',
    distancia: '3.2 km',
    empresaParceira: true,
    servicosDestaque: ['Reparos', 'Instalação', 'Desentupimento']
  },
  {
    id: 3,
    nome: 'Nova Cor Pinturas',
    descricao: 'Pinturas residenciais e comerciais com acabamento premium',
    imagem: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60',
    categoria: 'engenharia-civil',
    categoriaMain: 'engenharia',
    precoHora: 'R$ 80',
    rating: 4.9,
    reviews: 178,
    tempoMedioAtendimento: '4-8 horas',
    distancia: '1.8 km',
    empresaParceira: false,
    servicosDestaque: ['Pintura', 'Textura', 'Grafiato']
  },
  {
    id: 4,
    nome: 'Design Spaces',
    descricao: 'Studio de design de interiores com projetos personalizados',
    imagem: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&auto=format&fit=crop&q=60',
    categoria: 'arquitetura',
    categoriaMain: 'engenharia',
    precoHora: 'Sob consulta',
    rating: 4.9,
    reviews: 92,
    tempoMedioAtendimento: 'Agenda para consulta',
    distancia: '5.0 km',
    empresaParceira: false,
    servicosDestaque: ['Projetos', 'Consultoria', 'Decoração'],
    orcamento: 'Orçamento personalizado'
  },
  {
    id: 5,
    nome: 'TechFix Solutions',
    descricao: 'Assistência técnica especializada em eletrônicos e eletrodomésticos',
    imagem: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=60',
    categoria: 'suporte-ti',
    categoriaMain: 'tecnologia',
    precoHora: 'R$ 90',
    rating: 4.6,
    reviews: 167,
    tempoMedioAtendimento: '30-45 min',
    distancia: '4.2 km',
    empresaParceira: true,
    servicosDestaque: ['Reparo', 'Manutenção', 'Instalação'],
    destaque: '50% para novos clientes'
  }
];

export default function ServicosPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const categoriasContainerRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriasContainerRef.current) {
      const scrollAmount = 300; // Ajuste este valor conforme necessário
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
      setCategoriaAtiva('todas');
      setSubcategoriaAtiva('todas');
    } else {
      setCategoriaAtiva(categoriaId);
      setSubcategoriaAtiva('todas');
    }
  };

  const handleSubcategoriaClick = (subcategoriaId: string) => {
    setSubcategoriaAtiva(subcategoriaId === subcategoriaAtiva ? 'todas' : subcategoriaId);
  };

  // Filtra os serviços baseado na categoria selecionada e termo de busca
  const servicosFiltrados = servicosData.filter(servico => {
    const matchesCategoria = categoriaAtiva === 'todas' || servico.categoriaMain === categoriaAtiva;
    const matchesSubcategoria = subcategoriaAtiva === 'todas' || servico.categoria === subcategoriaAtiva;
    const matchesSearch = searchTerm === '' || 
      servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.servicosDestaque.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
        <h1 className="text-2xl font-bold mb-4">Serviços em sua região</h1>
        
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
              placeholder="Buscar serviços"
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Lista de Empresas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicosFiltrados.map((empresa, index) => (
            <Link 
              key={empresa.id} 
              href={`/empresas/${empresa.id}/perfil`}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-primary/20">
                {/* Container da Imagem */}
                <div className="relative h-48">
                  {empresa.destaque && (
                    <div className="absolute top-3 left-0 bg-red-600 text-white text-xs py-1 px-3 z-10">
                      {empresa.destaque}
                    </div>
                  )}
                  <Image
                    src={empresa.imagem}
                    alt={empresa.nome || 'Imagem da empresa'}
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
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{empresa.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {categorias.find(c => c.id === empresa.categoriaMain)?.subcategorias.find(s => s.id === empresa.categoria)?.nome}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm ml-1">{empresa.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({empresa.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{empresa.descricao}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {empresa.servicosDestaque.map((servico, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {servico}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{empresa.tempoMedioAtendimento}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{empresa.distancia}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-primary">
                        {empresa.precoHora}
                        {empresa.precoHora !== 'Sob consulta' && <span className="text-sm text-gray-500">/hora</span>}
                      </p>
                      {empresa.orcamento && (
                        <p className="text-xs text-gray-500">{empresa.orcamento}</p>
                      )}
                    </div>
                    {empresa.empresaParceira && (
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                        Empresa parceira
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