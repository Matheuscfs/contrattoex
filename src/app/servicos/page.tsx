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
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'name', 'price'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const categoriasContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log('🔍 Iniciando busca de empresas...');
      console.log('🌐 Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Definido' : 'Não definido',
        SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definido' : 'Não definido'
      });
      
      // Verificar se o cliente Supabase está configurado corretamente
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('❌ Variáveis de ambiente do Supabase não configuradas');
        // Fallback para dados mock em caso de problemas de configuração
        setCompanies(getMockCompanies());
        return;
      }
      
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

      console.log('📊 Resultado da busca:', {
        hasError: !!error,
        error: error?.message,
        dataLength: data?.length || 0,
        data: data
      });

      if (error) {
        console.error('❌ Erro ao buscar empresas:', error);
        // Em caso de erro, usar dados mock como fallback
        console.log('🔄 Usando dados mock como fallback...');
        setCompanies(getMockCompanies());
        return;
      }

      console.log('✅ Empresas carregadas com sucesso:', data?.length || 0);
      
      // Se não há dados, usar mock como fallback
      if (!data || data.length === 0) {
        console.log('⚠️ Nenhuma empresa encontrada, usando dados mock...');
        setCompanies(getMockCompanies());
      } else {
        setCompanies(data);
      }
    } catch (error) {
      console.error('💥 Erro fatal ao buscar empresas:', error);
      // Em caso de erro fatal, usar dados mock
      console.log('🔄 Usando dados mock devido a erro fatal...');
      setCompanies(getMockCompanies());
    } finally {
      setLoading(false);
      console.log('🏁 Busca de empresas finalizada');
    }
  };

  // Função para dados mock como fallback
  const getMockCompanies = (): Company[] => {
    return [
      {
        id: '61e4ba9a-c074-4920-9428-9a0dd2580f36',
        name: 'TK Inteligência e Monitoramento',
        description: 'Empresa especializada em sistemas de segurança, monitoramento e tecnologia',
        logo_url: '/tk-logo.png',
        rating: 5.0,
        total_reviews: 156,
        categories: ['seguranca', 'monitoramento', 'tecnologia'],
        business_type: 'Segurança e Tecnologia',
        company_addresses: [
          {
            city: 'Cascavel',
            state: 'PR',
            neighborhood: 'Centro'
          }
        ],
        company_contacts: [
          {
            phone: '(45) 8822-4299',
            email: 'supervisao@businessgestao.com.br'
          }
        ],
        company_services: [
          {
            name: 'Monitoramento 24h',
            price: 299.99,
            category: 'seguranca'
          },
          {
            name: 'Instalação de Câmeras',
            price: 1500.00,
            category: 'tecnologia'
          }
        ]
      },
      {
        id: '66864196-2cec-4321-abc3-0610a1eb4281',
        name: 'Business Consultoria & Governança',
        description: 'Empresa especializada em gestão empresarial, consultoria e soluções integradas. Oferecemos serviços de contabilidade, auditoria, consultoria atuarial, gestão de ativos intangíveis e treinamento em desenvolvimento profissional.',
        logo_url: '/business-logo.png',
        rating: 4.9,
        total_reviews: 234,
        categories: ['consultoria', 'contabilidade', 'gestao'],
        business_type: 'Consultoria & Governança',
        company_addresses: [
          {
            city: 'Cascavel',
            state: 'PR',
            neighborhood: 'Centro'
          }
        ],
        company_contacts: [
          {
            phone: '(45) 98822-4299',
            email: 'supervisao@businessgestao.com.br'
          }
        ],
        company_services: [
          {
            name: 'Consultoria Contábil',
            price: 300.00,
            category: 'contabilidade'
          },
          {
            name: 'Gestão Empresarial',
            price: 450.00,
            category: 'consultoria'
          },
          {
            name: 'Auditoria e Consultoria Atuarial',
            price: 0,
            category: 'consultoria'
          }
        ]
      },
      {
        id: 'd3ad1748-b338-4e7e-81f8-9258521eb49f',
        name: 'BR CENTER TRUCK',
        description: 'Centro automotivo especializado em veículos pesados e caminhões',
        logo_url: '/br-center-truck-logo.png',
        rating: 4.8,
        total_reviews: 89,
        categories: ['automotivo', 'manutencao'],
        business_type: 'Centro Automotivo',
        company_addresses: [
          {
            city: 'Cascavel',
            state: 'PR',
            neighborhood: 'Industrial'
          }
        ],
        company_contacts: [
          {
            phone: '(45) 3225-4567',
            email: 'contato@brcentertruck.com.br'
          }
        ],
        company_services: [
          {
            name: 'Manutenção Mecânica',
            price: 200.00,
            category: 'manutencao'
          },
          {
            name: 'Lanternagem e Pintura',
            price: 0,
            category: 'estetica'
          }
        ]
      },
      {
        id: 'd0c8441b-630e-42a6-82e5-9777cfebb6e7',
        name: 'TDK Corretora de Seguros',
        description: 'Corretora especializada em seguros automotivos e empresariais',
        logo_url: '/tdk-logo.png',
        rating: 5.0,
        total_reviews: 89,
        categories: ['financeiro', 'seguros', 'consultoria'],
        business_type: 'Serviços Financeiros',
        company_addresses: [
          {
            city: 'Cascavel',
            state: 'PR',
            neighborhood: 'Centro'
          }
        ],
        company_contacts: [
          {
            phone: '(45) 3224-1234',
            email: 'contato@tdkseguros.com.br'
          }
        ],
        company_services: [
          {
            name: 'Seguro Auto',
            price: 150.00,
            category: 'seguros'
          },
          {
            name: 'Consultoria em Seguros',
            price: 100.00,
            category: 'consultoria'
          }
        ]
      },
      {
        id: '567417a7-a3b9-4eac-94c8-c94bff147dcb',
        name: 'Grupo UNUS',
        description: 'Consultoria empresarial e desenvolvimento organizacional',
        logo_url: '/unus-logo.png',
        rating: 5.0,
        total_reviews: 203,
        categories: ['consultoria', 'gestao', 'desenvolvimento'],
        business_type: 'Consultoria Empresarial',
        company_addresses: [
          {
            city: 'Cascavel',
            state: 'PR',
            neighborhood: 'Centro'
          }
        ],
        company_contacts: [
          {
            phone: '(45) 3225-7890',
            email: 'contato@grupounus.com.br'
          }
        ],
        company_services: [
          {
            name: 'Consultoria Estratégica',
            price: 500.00,
            category: 'consultoria'
          },
          {
            name: 'Desenvolvimento de Equipes',
            price: 300.00,
            category: 'desenvolvimento'
          }
        ]
      },
      {
        id: 'f0982363-3a7d-459b-920f-81de9d162d96',
        name: 'TRANSDESK',
        description: 'Sistema de gestão logística e transporte',
        logo_url: '/transdesk-logo.png',
        rating: 4.9,
        total_reviews: 145,
        categories: ['logistica', 'tecnologia', 'gestao'],
        business_type: 'Tecnologia e Logística',
        company_addresses: [
          {
            city: 'Cascavel',
            state: 'PR',
            neighborhood: 'Centro'
          }
        ],
        company_contacts: [
          {
            phone: '(45) 3225-9999',
            email: 'contato@transdesk.com.br'
          }
        ],
        company_services: [
          {
            name: 'Sistema de Gestão',
            price: 800.00,
            category: 'tecnologia'
          },
          {
            name: 'Consultoria Logística',
            price: 400.00,
            category: 'consultoria'
          }
        ]
      }
    ];
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
      'holding': { main: 'servicos-empresariais', sub: 'consultoria' },
      'administracao': { main: 'servicos-empresariais', sub: 'consultoria' },
      'contabilidade': { main: 'servicos-empresariais', sub: 'contabilidade' },
      'reguladora': { main: 'servicos-empresariais', sub: 'consultoria' },
      'servicos': { main: 'servicos-empresariais', sub: 'consultoria' },
      'business': { main: 'servicos-empresariais', sub: 'consultoria' },
      'manutencao': { main: 'manutencao', sub: 'eletrica' },
      'sistemas': { main: 'tecnologia', sub: 'desenvolvimento' },
      'veiculos': { main: 'manutencao', sub: 'eletrica' },
      'automotivo': { main: 'manutencao', sub: 'eletrica' },
      'truck': { main: 'manutencao', sub: 'eletrica' },
      'centro': { main: 'servicos-empresariais', sub: 'consultoria' }
    };

    for (const category of categories) {
      const mapped = categoryMap[category.toLowerCase()];
      if (mapped) return mapped;
    }
    
    return { main: 'servicos-empresariais', sub: 'consultoria' };
  };

  // Filtrar empresas
  const empresasFiltradas = companies.filter(company => {
    // Se categoria for 'todas', ignora mapeamento e mostra todas as empresas
    if (categoriaAtiva === 'todas') {
      const matchesSearch = searchTerm === '' || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    }
    
    // Só aplica mapeamento quando uma categoria específica está selecionada
    const mapped = mapCategoryToUI(company.categories);
    const matchesCategoria = mapped.main === categoriaAtiva;
    const matchesSubcategoria = subcategoriaAtiva === 'todas' || mapped.sub === subcategoriaAtiva;
    const matchesSearch = searchTerm === '' || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategoria && matchesSubcategoria && matchesSearch;
  });

  // Funções de ordenação e filtragem avançada
  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getNumericPrice = (services: Company['company_services']) => {
    if (!services || services.length === 0) return 0;
    const total = services.reduce((sum, service) => sum + service.price, 0);
    return total / services.length;
  };

  // Aplicar ordenação
  const empresasOrdenadas = [...empresasFiltradas].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'price':
        comparison = getNumericPrice(a.company_services) - getNumericPrice(b.company_services);
        break;
      case 'reviews':
        comparison = a.total_reviews - b.total_reviews;
        break;
      default:
        comparison = a.rating - b.rating;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Aplicar filtros adicionais
  const empresasFinais = empresasOrdenadas.filter(company => {
    const avgPrice = getNumericPrice(company.company_services);
    const matchesPrice = avgPrice === 0 || (avgPrice >= priceRange[0] && avgPrice <= priceRange[1]);
    const matchesRating = company.rating >= ratingFilter;
    
    return matchesPrice && matchesRating;
  });

  // Contar filtros ativos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (ratingFilter > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 50000) count++;
    if (categoriaAtiva !== 'todas') count++;
    if (subcategoriaAtiva !== 'todas') count++;
    if (searchTerm !== '') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

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

  // Função para obter logo específica da empresa baseada no ID
  const getCompanyLogo = (companyId: string, companyName: string) => {
    const logoMap: { [key: string]: string } = {
      'd3ad1748-b338-4e7e-81f8-9258521eb49f': '/br-center-truck-logo.png', // BR CENTER TRUCK
      '66864196-2cec-4321-abc3-0610a1eb4281': '/business-logo.png', // BUSINESS
      'f0982363-3a7d-459b-920f-81de9d162d96': '/transdesk-logo.png', // TRANSDESK
      '567417a7-a3b9-4eac-94c8-c94bff147dcb': '/unus-logo.png', // UNUS
      'd0c8441b-630e-42a6-82e5-9777cfebb6e7': '/tdk-logo.png', // TDK
      '61e4ba9a-c074-4920-9428-9a0dd2580f36': '/tk-logo.png', // TK REGULADORA
    };

    return logoMap[companyId] || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando empresas...</p>
          <p className="mt-2 text-sm text-gray-500">
            Conectando ao banco de dados...
          </p>
        </div>
      </div>
    );
  }

  // Debug info - só mostrar quando não há empresas
  const showDebug = companies.length === 0 && !loading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info Section */}
      {showDebug && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Debug Info:</strong>
              </p>
              <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                <li>• Total de empresas carregadas: {companies.length}</li>
                <li>• Empresas após filtro: {empresasFinais.length}</li>
                <li>• Ambiente: {process.env.NODE_ENV || 'undefined'}</li>
                <li>• Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurado' : 'Não configurado'}</li>
                <li>• Termo de busca: "{searchTerm}"</li>
                <li>• Categoria ativa: {categoriaAtiva}</li>
                <li>• Loading: {loading ? 'Sim' : 'Não'}</li>
              </ul>
              {companies.length === 0 && !loading && (
                <button 
                  onClick={fetchCompanies}
                  className="mt-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                >
                  Tentar recarregar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
    <div>
      {/* Barra de Categorias */}
      <div className="border-b sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4">
          <div className="relative">
            {/* Botão de navegação esquerda */}
            <button
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-60 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Container das categorias com ref */}
            <div 
              ref={categoriasContainerRef}
              className="flex overflow-x-auto scrollbar-hide py-6 -mb-px scroll-smooth"
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
                    <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-2 min-w-[200px] z-70">
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-60 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
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
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">
            Serviços em sua região
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <span>{empresasFinais.length} empresas encontradas</span>
            {activeFiltersCount > 0 && (
              <>
                <span>•</span>
                <span className="text-blue-600">{activeFiltersCount} filtro(s) aplicado(s)</span>
              </>
            )}
            {companies.length !== empresasFinais.length && (
              <>
                <span>•</span>
                <span className="text-gray-500">
                  {companies.length - empresasFinais.length} empresas filtradas
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-3">
            {/* Filtros Button */}
            <div className="relative">
              <Button 
                variant={showFilters ? "default" : (activeFiltersCount > 0 ? "default" : "outline")} 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path><path d="M7 12h10"></path><path d="M11 18h4"></path>
                </svg>
                Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`} {showFilters && '✓'}
              </Button>
            </div>

            {/* Ordenar Dropdown */}
            <div className="relative group">
              <Button variant="outline" className="flex items-center gap-2">
                Ordenar: {sortBy === 'rating' ? 'Avaliação' : sortBy === 'name' ? 'Nome' : sortBy === 'price' ? 'Preço' : 'Avaliações'}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </Button>
              <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-2 min-w-[150px] z-20">
                <button
                  onClick={() => handleSortChange('rating')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'rating' ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  Avaliação {sortBy === 'rating' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSortChange('name')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'name' ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  Nome {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSortChange('price')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'price' ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  Preço {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button
                  onClick={() => handleSortChange('reviews')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'reviews' ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  Nº Avaliações {sortBy === 'reviews' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              </div>
            </div>

            {/* Distância - pode ser implementado depois */}
            <Button variant="outline" className="flex items-center gap-2">
              Distância
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
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
        
        {/* Painel de Filtros Avançados */}
        {showFilters && (
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por Avaliação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação Mínima
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{ratingFilter}★</span>
                </div>
              </div>

              {/* Filtro por Faixa de Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de Preço (R$)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setRatingFilter(0);
                    setPriceRange([0, 50000]);
                    setCategoriaAtiva('todas');
                    setSubcategoriaAtiva('todas');
                    setSearchTerm('');
                  }}
                >
                  Limpar Filtros
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  Aplicar
                </Button>
              </div>
            </div>

            {/* Indicadores de Filtros Ativos */}
            <div className="flex flex-wrap gap-2 mt-3">
              {ratingFilter > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Avaliação ≥ {ratingFilter}★
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                </span>
              )}
              {categoriaAtiva !== 'todas' && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Categoria: {categorias.find(c => c.id === categoriaAtiva)?.nome}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Lista de Empresas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresasFinais.map((empresa, index) => (
            <Link 
              key={empresa.id} 
              href={`/empresas/${empresa.id}/perfil`}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-primary/20">
                {/* Container da Imagem */}
                <div className="relative h-48">
                  <Image
                    src={getCompanyLogo(empresa.id, empresa.name)}
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

        {empresasFinais.length === 0 && !loading && (
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
    </div>
  );
} 