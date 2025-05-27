'use client'

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Search, Star, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

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
    id: 'manutencao',
    nome: 'Manutenção & Instalações Comerciais',
    subcategorias: [
      { id: 'eletrica', nome: 'Elétrica & Hidráulica' },
      { id: 'climatizacao', nome: 'Ar-condicionado & Climatização' },
      { id: 'seguranca', nome: 'CFTV & Segurança Eletrônica' },
      { id: 'limpeza', nome: 'Limpeza Técnica & Predial' }
    ]
  }
];

interface Company {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  rating: number;
  total_reviews: number;
  categories: string[];
  business_type: string;
  company_addresses: Array<{
    city: string;
    state: string;
    neighborhood: string;
  }>;
  company_contacts: Array<{
    phone: string;
    email: string;
  }>;
  company_services: Array<{
    name: string;
    price: number;
    category: string;
  }>;
}

export default function ServicosPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const categoriasContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          description,
          logo_url,
          rating,
          total_reviews,
          categories,
          business_type,
          company_addresses (
            city,
            state,
            neighborhood
          ),
          company_contacts (
            phone,
            email
          ),
          company_services (
            name,
            price,
            category
          )
        `)
        .eq('status', 'active')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Erro ao buscar empresas:', error);
        return;
      }

      setCompanies(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
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

  // Mapear categorias do banco para as categorias da UI
  const mapCategoryToUI = (categories: string[]) => {
    const categoryMap: { [key: string]: { main: string; sub: string } } = {
      'logistica': { main: 'logistica', sub: 'cargas' },
      'cargas': { main: 'logistica', sub: 'cargas' },
      'transporte': { main: 'logistica', sub: 'cargas' },
      'financeiro': { main: 'servicos-empresariais', sub: 'financeiro' },
      'seguros': { main: 'servicos-empresariais', sub: 'financeiro' },
      'consultoria': { main: 'servicos-empresariais', sub: 'consultoria' },
      'seguranca': { main: 'manutencao', sub: 'seguranca' },
      'monitoramento': { main: 'manutencao', sub: 'seguranca' },
      'tecnologia': { main: 'tecnologia', sub: 'desenvolvimento' },
      'gestao': { main: 'servicos-empresariais', sub: 'consultoria' },
      'desenvolvimento': { main: 'tecnologia', sub: 'desenvolvimento' },
      'software': { main: 'tecnologia', sub: 'desenvolvimento' },
      'automacao': { main: 'tecnologia', sub: 'automacao' },
    };

    for (const category of categories) {
      const mapped = categoryMap[category.toLowerCase()];
      if (mapped) return mapped;
    }
    
    return { main: 'servicos-empresariais', sub: 'consultoria' };
  };

  // Filtrar empresas
  const empresasFiltradas = companies.filter(company => {
    const mapped = mapCategoryToUI(company.categories);
    const matchesCategoria = categoriaAtiva === 'todas' || mapped.main === categoriaAtiva;
    const matchesSubcategoria = subcategoriaAtiva === 'todas' || mapped.sub === subcategoriaAtiva;
    const matchesSearch = searchTerm === '' || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategoria && matchesSubcategoria && matchesSearch;
  });

  // Função para calcular preço médio dos serviços
  const getAveragePrice = (services: Company['company_services']) => {
    if (!services || services.length === 0) return 'Sob consulta';
    const total = services.reduce((sum, service) => sum + service.price, 0);
    const average = total / services.length;
    return `R$ ${average.toFixed(0)}`;
  };

  // Função para obter serviços em destaque
  const getHighlightServices = (services: Company['company_services']) => {
    if (!services || services.length === 0) return ['Consulte serviços'];
    return services.slice(0, 3).map(service => service.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando empresas...</p>
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
                    categoriaAtiva === 'todas'
                      ? 'bg-red-500 text-white'
                      : 'hover:bg-red-50'
                  }`}
                  onClick={() => handleCategoriaClick('todas')}
                >
                  Todas as Categorias
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
          Serviços em sua região ({empresasFiltradas.length} empresas encontradas)
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
              placeholder="Buscar serviços"
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Lista de Empresas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresasFiltradas.map((empresa, index) => (
            <Link 
              key={empresa.id} 
              href={`/empresas/${empresa.id}/perfil`}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-primary/20">
                {/* Container da Imagem */}
                <div className="relative h-48">
                  <Image
                    src={empresa.logo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60'}
                    alt={empresa.name || 'Logo da empresa'}
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
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{empresa.name}</h3>
                      <p className="text-sm text-gray-600">
                        {empresa.business_type}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm ml-1">{empresa.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({empresa.total_reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{empresa.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {getHighlightServices(empresa.company_services).map((servico, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {servico}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Consulte horários</span>
                    <span className="mx-2">•</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {empresa.company_addresses?.[0]?.city || 'São Paulo'}, {empresa.company_addresses?.[0]?.state || 'SP'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-primary">
                        {getAveragePrice(empresa.company_services)}
                        {getAveragePrice(empresa.company_services) !== 'Sob consulta' && <span className="text-sm text-gray-500">/serviço</span>}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                      {empresa.company_services?.length || 0} serviços
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {empresasFiltradas.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma empresa encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </div>
    </div>
  );
} 