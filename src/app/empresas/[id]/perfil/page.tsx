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
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';

interface CompanyProfile {
  id: string;
  user_id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  responsible_name?: string;
  logo_url?: string;
  website?: string;
  description?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  business_hours?: any;
  created_at: string;
  updated_at: string;
}

interface CompanyPageProps {
  params: {
    id: string;
  };
}

function CompanySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Skeleton className="w-32 h-32 rounded-lg mx-auto" />
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

export default function CompanyPublicProfilePage({ params }: CompanyPageProps) {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadCompanyProfile();
  }, [params.id]);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      
      // Se o ID for o específico da TK Reguladora, usar dados mockados
      if (params.id === '61e4ba9a-c074-4920-9428-9a0dd2580f36') {
        setCompany({
          id: '61e4ba9a-c074-4920-9428-9a0dd2580f36',
          user_id: '61e4ba9a-c074-4920-9428-9a0dd2580f36',
          cnpj: '22.089.428/0001-95',
          razao_social: 'TK REGULADORA E LOCACAO DE VEICULOS LTDA',
          nome_fantasia: 'TK REGULADORA',
          inscricao_estadual: '',
          responsible_name: '',
          logo_url: undefined,
          website: '',
          description: 'Empresa especializada em locação de automóveis sem condutor, regulação de sinistros e serviços automotivos. Com mais de 10 anos de experiência no mercado, oferecemos soluções completas para o setor automotivo.',
          address_street: 'RUA MARINGA',
          address_number: '2182',
          address_complement: 'SALA01',
          address_neighborhood: 'SAO CRISTOVAO',
          address_city: 'CASCAVEL',
          address_state: 'PR',
          address_zip_code: '85816-595',
          contact_phone: '(45) 8822-4299',
          contact_email: 'supervisao@businessgestao.com.br',
          contact_whatsapp: '(45) 8822-4299',
          business_hours: {
            weekdays: { start: '08:00', end: '18:00', enabled: true },
            saturday: { start: '08:00', end: '12:00', enabled: true },
            sunday: { start: '', end: '', enabled: false }
          },
          created_at: '2015-03-20T00:00:00Z',
          updated_at: new Date().toISOString()
        });
      } 
      // BR CENTER TRUCK
      else if (params.id === 'd3ad1748-b338-4e7e-81f8-9258521eb49f') {
        setCompany({
          id: 'd3ad1748-b338-4e7e-81f8-9258521eb49f',
          user_id: 'd3ad1748-b338-4e7e-81f8-9258521eb49f',
          cnpj: '31.636.919/0001-08',
          razao_social: 'BR CENTER TRUCK SERVICOS AUTOMOTIVOS LTDA',
          nome_fantasia: 'BR CENTER TRUCK',
          inscricao_estadual: '',
          responsible_name: '',
          logo_url: undefined,
          website: '',
          description: 'Especializada em serviços de manutenção e reparação mecânica de veículos automotores, oferecendo soluções completas para caminhões e veículos pesados. Nossa equipe técnica qualificada garante qualidade e confiabilidade em todos os serviços.',
          address_street: 'Rodovia Br-277 Km 612',
          address_number: 'S/N',
          address_complement: 'LOTE RURAL N. 74-A-1',
          address_neighborhood: 'Area Rural',
          address_city: 'Santa Tereza do Oeste',
          address_state: 'PR',
          address_zip_code: '85825-000',
          contact_phone: '(45) 3036-3628',
          contact_email: 'selso@univel.br',
          contact_whatsapp: '(45) 3036-3625',
          business_hours: {
            weekdays: { start: '07:00', end: '17:00', enabled: true },
            saturday: { start: '07:00', end: '12:00', enabled: true },
            sunday: { start: '', end: '', enabled: false }
          },
          created_at: '2018-09-28T00:00:00Z',
          updated_at: new Date().toISOString()
        });
      }
      // BUSINESS
      else if (params.id === '66864196-2cec-4321-abc3-0610a1eb4281') {
        setCompany({
          id: '66864196-2cec-4321-abc3-0610a1eb4281',
          user_id: '66864196-2cec-4321-abc3-0610a1eb4281',
          cnpj: '28.922.898/0001-74',
          razao_social: 'CONSULTORIA CONTABIL BUSINESS LTDA',
          nome_fantasia: 'BUSINESS CONSULTORIA E GOVERNANCA',
          inscricao_estadual: '',
          responsible_name: '',
          logo_url: undefined,
          website: 'www.businessgestao.com.br',
          description: 'Empresa especializada em gestão empresarial, consultoria e soluções integradas. Oferecemos serviços de contabilidade, auditoria, consultoria atuarial, gestão de ativos intangíveis e treinamento em desenvolvimento profissional. Nossa missão é impulsionar o crescimento e a eficiência dos nossos clientes.',
          address_street: 'Rua Siqueira Campos',
          address_number: '1281',
          address_complement: 'Anexo B',
          address_neighborhood: 'CENTRO',
          address_city: 'CASCAVEL',
          address_state: 'PR',
          address_zip_code: '85812-220',
          contact_phone: '(45) 98822-4299',
          contact_email: 'supervisao@businessgestao.com.br',
          contact_whatsapp: '(45) 98822-4299',
          business_hours: {
            weekdays: { start: '08:00', end: '18:00', enabled: true },
            saturday: { start: '08:00', end: '12:00', enabled: true },
            sunday: { start: '', end: '', enabled: false }
          },
          created_at: '2017-10-24T00:00:00Z',
          updated_at: new Date().toISOString()
        });
      }
      // TRANSDESK
      else if (params.id === 'f0982363-3a7d-459b-920f-81de9d162d96') {
        setCompany({
          id: 'f0982363-3a7d-459b-920f-81de9d162d96',
          user_id: 'f0982363-3a7d-459b-920f-81de9d162d96',
          cnpj: '03.323.717/0001-62',
          razao_social: 'TS CONSULTORIA EM TRANSPORTES LTDA',
          nome_fantasia: 'TRANSDESK SERVICE',
          inscricao_estadual: '',
          responsible_name: '',
          logo_url: undefined,
          website: 'www.transdesk.com.br',
          description: 'Logística e transportes, soluções em transporte rodoviário. Empresa líder no segmento de transporte, com mais de 25 anos de experiência oferecendo soluções completas em logística, transporte rodoviário de cargas e gestão de frotas. Atendemos mais de 15 mil transportadores em todo o Brasil.',
          address_street: 'RUA ANIBAL CURI',
          address_number: '255',
          address_complement: 'ANDAR 3 SALA2 - FAG',
          address_neighborhood: 'FAG',
          address_city: 'CASCAVEL',
          address_state: 'PR',
          address_zip_code: '85806-097',
          contact_phone: '(45) 8822-4299',
          contact_email: 'contato@gestaobusiness.com.br',
          contact_whatsapp: '(45) 98765-4321',
          business_hours: {
            weekdays: { start: '08:00', end: '18:00', enabled: true },
            saturday: { start: '08:00', end: '12:00', enabled: true },
            sunday: { start: '', end: '', enabled: false }
          },
          created_at: '1999-08-04T00:00:00Z',
          updated_at: new Date().toISOString()
        });
      }
      // UNUS
      else if (params.id === '567417a7-a3b9-4eac-94c8-c94bff147dcb') {
        setCompany({
          id: '567417a7-a3b9-4eac-94c8-c94bff147dcb',
          user_id: '567417a7-a3b9-4eac-94c8-c94bff147dcb',
          cnpj: '21.975.647/0001-09',
          razao_social: 'UNUS HOLDING S/A',
          nome_fantasia: 'UNUS HOLDING',
          inscricao_estadual: '',
          responsible_name: '',
          logo_url: undefined,
          website: '',
          description: 'Tecnologia e inovação, desenvolvimento de software. Holding especializada em instituições não-financeiras, atuando nos segmentos de comércio automotivo, gestão imobiliária, publicidade, recursos humanos e serviços especializados de apoio administrativo.',
          address_street: 'RUA SIQUEIRA CAMPOS',
          address_number: '1281',
          address_complement: 'ANDAR SEGUNDO SALA03 - CENTRO',
          address_neighborhood: 'CENTRO',
          address_city: 'CASCAVEL',
          address_state: 'PR',
          address_zip_code: '85812-220',
          contact_phone: '(45) 3122-5100',
          contact_email: 'contato@businessgestao.com.br',
          contact_whatsapp: '(45) 9981-7932',
          business_hours: {
            weekdays: { start: '08:00', end: '18:00', enabled: true },
            saturday: { start: '08:00', end: '12:00', enabled: true },
            sunday: { start: '', end: '', enabled: false }
          },
          created_at: '2015-03-04T00:00:00Z',
          updated_at: new Date().toISOString()
        });
      }
      // TDK
      else if (params.id === 'd0c8441b-630e-42a6-82e5-9777cfebb6e7') {
        setCompany({
          id: 'd0c8441b-630e-42a6-82e5-9777cfebb6e7',
          user_id: 'd0c8441b-630e-42a6-82e5-9777cfebb6e7',
          cnpj: '19.437.591/0001-97',
          razao_social: 'TDK CORRETORA DE SEGUROS LTDA',
          nome_fantasia: 'TDK CORRETORA',
          inscricao_estadual: '',
          responsible_name: '',
          logo_url: undefined,
          website: '',
          description: 'TDK Corretora de Seguros é especialista em seguros para transportadores. Oferece seguros nacionais e internacionais, em todas as companhias do mercado. A corretora é devidamente credenciada junto à SUSEP (10.2017899-9) e atua em todos os ramos: seguro de vida, seguro residencial, seguro viagem, seguro para celular e seguro auto simplificado.',
          address_street: 'Rua Goias',
          address_number: '1530',
          address_complement: '',
          address_neighborhood: 'COUNTRY',
          address_city: 'CASCAVEL',
          address_state: 'PR',
          address_zip_code: '85813-070',
          contact_phone: '(45) 3122-5100',
          contact_email: 'selso@univel.br',
          contact_whatsapp: '(45) 3122-5100',
          business_hours: {
            weekdays: { start: '08:00', end: '18:00', enabled: true },
            saturday: { start: '08:00', end: '12:00', enabled: true },
            sunday: { start: '', end: '', enabled: false }
          },
          created_at: '2013-12-18T00:00:00Z',
          updated_at: new Date().toISOString()
        });
      }
      else {
        // Buscar dados reais do Supabase
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .eq('user_id', params.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Empresa não encontrada');
          } else {
            setError('Erro ao carregar dados da empresa');
          }
          return;
        }

        setCompany(data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil da empresa:', error);
      setError('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  const getLogoUrl = (companyName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=1f2937&color=ffffff&size=200&format=svg`;
  };

  // Componente da Logo da TK Reguladora
  const TKLogo = () => (
    <div className="flex items-center justify-center w-full h-full relative overflow-hidden bg-white">
      <Image
        src="/tk-logo.png"
        alt="TK Reguladora"
        width={128}
        height={128}
        className="object-contain w-full h-full p-2"
      />
    </div>
  );

  const getCompanyLogo = (companyId: string, companyName: string) => {
    const logoMap: { [key: string]: string } = {
      'd3ad1748-b338-4e7e-81f8-9258521eb49f': '/br-center-truck-logo.png', // BR CENTER TRUCK
      '66864196-2cec-4321-abc3-0610a1eb4281': '/business-logo.png', // BUSINESS
      'f0982363-3a7d-459b-920f-81de9d162d96': '/transdesk-logo.png', // TRANSDESK
      '567417a7-a3b9-4eac-94c8-c94bff147dcb': '/unus-logo.png', // UNUS
      'd0c8441b-630e-42a6-82e5-9777cfebb6e7': '/tdk-logo.png', // TDK
      '61e4ba9a-c074-4920-9428-9a0dd2580f36': '/tk-logo.png', // TK REGULADORA
    };

    const logoSrc = logoMap[companyId];
    
    if (logoSrc) {
      return (
        <div className="flex items-center justify-center w-full h-full relative overflow-hidden bg-white">
          <Image
            src={logoSrc}
            alt={companyName}
            width={128}
            height={128}
            className="object-contain w-full h-full p-2"
          />
        </div>
      );
    }
    
    // Fallback para avatar gerado
    return (
      <Image
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=1f2937&color=ffffff&size=200&format=svg`}
        alt={companyName}
        width={128}
        height={128}
        className="object-cover w-full h-full"
      />
    );
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/^(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
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

  const getCompanyAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    return years;
  };

  const getServicesForCompany = (companyId: string) => {
    switch (companyId) {
      case 'd3ad1748-b338-4e7e-81f8-9258521eb49f': // BR CENTER TRUCK
        return [
          {
            id: '1',
            name: 'Manutenção Mecânica',
            description: 'Serviços completos de manutenção e reparação mecânica para veículos pesados e caminhões',
            price: 'A partir de R$ 200,00',
            duration: 'Conforme serviço',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
          },
          {
            id: '2',
            name: 'Lanternagem e Pintura',
            description: 'Serviços especializados de funilaria e pintura para veículos automotores',
            price: 'Sob consulta',
            duration: 'Conforme caso',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
          },
          {
            id: '3',
            name: 'Elétrica Automotiva',
            description: 'Manutenção e reparação do sistema elétrico de veículos',
            price: 'R$ 120,00/hora',
            duration: 'Conforme serviço',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
          }
        ];

      case '66864196-2cec-4321-abc3-0610a1eb4281': // BUSINESS
        return [
          {
            id: '1',
            name: 'Consultoria Contábil',
            description: 'Serviços completos de contabilidade para pessoas físicas e jurídicas',
            price: 'A partir de R$ 300,00/mês',
            duration: 'Mensal',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
          },
          {
            id: '2',
            name: 'Auditoria e Consultoria Atuarial',
            description: 'Auditoria e consultoria especializada em análise atuarial',
            price: 'Sob consulta',
            duration: 'Conforme projeto',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
          },
          {
            id: '3',
            name: 'Gestão Empresarial',
            description: 'Consultoria em gestão empresarial e otimização de processos',
            price: 'R$ 450,00/hora',
            duration: 'Conforme necessidade',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop'
          }
        ];

      case 'f0982363-3a7d-459b-920f-81de9d162d96': // TRANSDESK
        return [
          {
            id: '1',
            name: 'Transporte Rodoviário',
            description: 'Transporte rodoviário de cargas municipal, intermunicipal e internacional',
            price: 'A partir de R$ 2,50/km',
            duration: 'Conforme distância',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'
          },
          {
            id: '2',
            name: 'Gestão de Frotas',
            description: 'Gestão completa de frotas e operações logísticas',
            price: 'Sob consulta',
            duration: 'Contrato mensal',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
          },
          {
            id: '3',
            name: 'Consultoria em Transportes',
            description: 'Consultoria especializada em otimização de transportes e logística',
            price: 'R$ 350,00/hora',
            duration: 'Conforme projeto',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
          }
        ];

      case '567417a7-a3b9-4eac-94c8-c94bff147dcb': // UNUS
        return [
          {
            id: '1',
            name: 'Desenvolvimento de Software',
            description: 'Desenvolvimento de soluções tecnológicas personalizadas',
            price: 'A partir de R$ 15.000,00',
            duration: 'Conforme projeto',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=300&fit=crop'
          },
          {
            id: '2',
            name: 'Gestão Imobiliária',
            description: 'Administração e gestão de propriedades imobiliárias',
            price: 'Sob consulta',
            duration: 'Contrato anual',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'
          },
          {
            id: '3',
            name: 'Recursos Humanos',
            description: 'Fornecimento e gestão de recursos humanos para terceiros',
            price: 'R$ 2.500,00/mês',
            duration: 'Mensal',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop'
          }
        ];

      case 'd0c8441b-630e-42a6-82e5-9777cfebb6e7': // TDK
        return [
          {
            id: '1',
            name: 'Seguro de Vida',
            description: 'Seguro de vida com as melhores coberturas do mercado',
            price: 'A partir de R$ 45,00/mês',
            duration: 'Anual',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop'
          },
          {
            id: '2',
            name: 'Seguro Residencial',
            description: 'Proteção completa para sua residência e bens',
            price: 'A partir de R$ 89,00/mês',
            duration: 'Anual',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
          },
          {
            id: '3',
            name: 'Seguro Auto',
            description: 'Seguro automotivo simplificado com cobertura nacional',
            price: 'A partir de R$ 150,00/mês',
            duration: 'Anual',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'
          }
        ];

      default: // TK REGULADORA e outros
        return [
    {
      id: '1',
      name: 'Locação de Veículos',
      description: 'Locação de automóveis sem condutor para empresas e particulares',
      price: 'A partir de R$ 150,00/dia',
      duration: 'Diária',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Regulação de Sinistros',
      description: 'Serviços especializados em regulação e análise de sinistros automotivos',
      price: 'Sob consulta',
      duration: 'Conforme caso',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      name: 'Consultoria Automotiva',
      description: 'Consultoria especializada para o setor automotivo',
      price: 'R$ 299,00/hora',
      duration: '1 hora',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
    }
  ];
    }
  };

  const services = getServicesForCompany(company?.id || '');

  const getCompanyStats = (companyId: string) => {
    switch (companyId) {
      case 'd3ad1748-b338-4e7e-81f8-9258521eb49f': // BR CENTER TRUCK
        return [
          { number: '6+', label: 'anos de experiência' },
          { number: '500+', label: 'veículos atendidos' },
          { number: '✓', label: 'Equipamentos modernos' }
        ];
      case '66864196-2cec-4321-abc3-0610a1eb4281': // BUSINESS
        return [
          { number: '7+', label: 'anos de experiência' },
          { number: '200+', label: 'empresas atendidas' },
          { number: '✓', label: 'Consultoria especializada' }
        ];
      case 'f0982363-3a7d-459b-920f-81de9d162d96': // TRANSDESK
        return [
          { number: '25+', label: 'anos de experiência' },
          { number: '15k+', label: 'transportadores atendidos' },
          { number: '✓', label: 'Líder no segmento' }
        ];
      case '567417a7-a3b9-4eac-94c8-c94bff147dcb': // UNUS
        return [
          { number: '10+', label: 'anos de experiência' },
          { number: '100+', label: 'projetos realizados' },
          { number: '✓', label: 'Holding consolidada' }
        ];
      case 'd0c8441b-630e-42a6-82e5-9777cfebb6e7': // TDK
        return [
          { number: '11+', label: 'anos de experiência' },
          { number: '1000+', label: 'seguros emitidos' },
          { number: '✓', label: 'Credenciada SUSEP' }
        ];
      default: // TK REGULADORA
        return [
          { number: '10+', label: 'anos de experiência' },
          { number: '100%', label: 'Atendimento em todo o Brasil' },
          { number: '✓', label: 'Soluções sustentáveis' }
        ];
    }
  };

  const companyStats = getCompanyStats(company?.id || '');

  const galleryImages = [
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop'
  ];

  const relatedCompanies = [
    {
      id: '1',
      name: 'AutoSolutions Cascavel',
      description: 'Serviços automotivos especializados em manutenção e reparo',
      rating: 4.7,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Seguros & Regulação PR',
      description: 'Especializada em seguros e regulação de sinistros no Paraná',
      rating: 4.6,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      name: 'Frota Express',
      description: 'Gestão e locação de frotas para empresas',
      rating: 4.8,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'
    }
  ];

  if (loading) {
    return <CompanySkeleton />;
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Empresa não encontrada'}
          </h1>
          <p className="text-gray-600 mb-4">
            A empresa que você está procurando não existe ou foi removida.
          </p>
          <Link href="/empresas">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Empresas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="relative h-[500px] md:h-[600px] bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Background Pattern/Texture */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
        
        {/* Navigation */}
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/empresas">
              <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Company Info */}
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/30 bg-white/10 backdrop-blur-sm shadow-2xl">
                {getCompanyLogo(company.id, company.nome_fantasia || company.razao_social)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
                {company.nome_fantasia || company.razao_social}
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-6 md:mb-8 max-w-4xl leading-relaxed">
                {company.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 text-sm md:text-base text-blue-200 mb-6 md:mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span>{company.address_city}, {company.address_state}</span>
                </div>
                <Badge className="bg-green-500/90 hover:bg-green-500 text-white border-0 shadow-lg px-3 py-1 w-fit">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  Empresa Ativa
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-0 px-6 py-3">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Enviar mensagem
                </Button>
                <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 py-3">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Ligar
                </Button>
                <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 py-3">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg md:text-xl font-semibold">Sobre a Empresa</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {company.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {companyStats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">{stat.number}</div>
                      <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                  </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Horário de Funcionamento</h3>
                  <p className="text-sm md:text-base text-gray-600">Segunda à Sexta: {getBusinessHoursText(company.business_hours)}</p>
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

            {/* Services Section */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-6">Serviços</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-40 md:h-48">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 md:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm md:text-base">{service.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                            <span className="text-xs md:text-sm font-medium">{service.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs md:text-sm text-gray-500">Duração: {service.duration}</span>
                          <span className="font-bold text-sm md:text-lg">{service.price}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 text-xs md:text-sm">Orçamento</Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs md:text-sm">Contratar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery Section */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-6">Galeria</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative h-32 md:h-48 rounded-lg overflow-hidden">
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

            {/* Reviews Section */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-6">Avaliações e Comentários</h2>
                
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">4,8</div>
                    <div className="flex items-center gap-1 mb-1 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">Baseado em 100 avaliações</div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-xs md:text-sm w-6 md:w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                          ></div>
                        </div>
                        <span className="text-xs md:text-sm text-gray-600 w-6 md:w-8">{rating === 5 ? 70 : rating === 4 ? 20 : 5}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full mb-6">Escrever avaliação</Button>

                <div className="border-t pt-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      JS
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-semibold text-sm md:text-base">João Silva</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs md:text-sm text-gray-500">14/02/2024</span>
                      </div>
                      <p className="text-sm md:text-base text-gray-600">Excelente serviço de locação de veículos. Carros sempre limpos e em perfeito estado. Atendimento muito profissional.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Companies */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-6">Empresas Relacionadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {relatedCompanies.map((relatedCompany) => (
                    <div key={relatedCompany.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-24 md:h-32">
                        <Image
                          src={relatedCompany.image}
                          alt={relatedCompany.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 md:p-4">
                        <h3 className="font-semibold mb-2 text-sm md:text-base">{relatedCompany.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{relatedCompany.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                            <span className="text-xs md:text-sm font-medium">{relatedCompany.rating}</span>
                            <span className="text-xs text-gray-500">({relatedCompany.reviews} avaliações)</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full text-xs md:text-sm">Ver Perfil</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Location */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Localização</h3>
                <div className="bg-gray-100 h-40 md:h-48 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{company.address_street}, {company.address_number}</p>
                  {company.address_complement && <p>{company.address_complement}</p>}
                  <p>{company.address_neighborhood}</p>
                  <p>{company.address_city} - {company.address_state}</p>
                  <p>CEP: {company.address_zip_code}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Ligar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Confiabilidade</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold mb-3">Destaques</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-xs md:text-sm">10+ anos de experiência</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-xs md:text-sm">Atendimento em todo o Brasil</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-xs md:text-sm">Soluções sustentáveis</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-xs md:text-sm break-all">CNPJ: {formatCNPJ(company.cnpj)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Contato</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-xs md:text-sm">{formatPhone(company.contact_phone || '')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-xs md:text-sm break-all">{company.contact_email}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-blue-600 hover:underline break-all">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 