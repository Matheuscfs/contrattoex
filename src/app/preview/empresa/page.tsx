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
  Building2,
  CheckCircle,
  Award,
  Users,
  Briefcase,
  FileText,
  ExternalLink,
  Calendar,
  Edit,
  Eye,
  Timer,
  Laptop,
  Home,
  ArrowLeft,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  MessageSquare,
  Target,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Download,
  Filter,
  Search,
  PieChart,
  LineChart,
  Activity,
  Zap,
  ShoppingCart,
  Calendar as CalendarIcon,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

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

export default function EmpresaDashboardPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editData, setEditData] = useState<CompanyProfile | null>(null);

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

  const getDashboardStats = () => {
    return {
      totalViews: 12847,
      viewsChange: '+15.3%',
      newLeads: 89,
      leadsChange: '+23.1%',
      conversions: 34,
      conversionsChange: '+8.7%',
      revenue: 'R$ 145.200',
      revenueChange: '+12.5%',
      avgRating: 4.9,
      totalProjects: 1247,
      activeProjects: 23,
      completedThisMonth: 12,
      clientSatisfaction: 98,
      responseTime: '2h',
      onTimeDelivery: 95,
      teamProductivity: 87
    };
  };

  const getRecentActivity = () => {
    return [
      { id: 1, type: 'lead', message: 'Novo lead: Maria Silva solicitou orçamento para ERP', time: '5 min atrás', icon: UserCheck },
      { id: 2, type: 'project', message: 'Projeto "App Mobile XYZ" foi concluído', time: '1h atrás', icon: CheckCircle },
      { id: 3, type: 'review', message: 'Nova avaliação 5⭐ de Carlos Santos', time: '2h atrás', icon: Star },
      { id: 4, type: 'message', message: '3 novas mensagens de clientes', time: '3h atrás', icon: MessageSquare },
      { id: 5, type: 'proposal', message: 'Proposta enviada para ACME Corp', time: '5h atrás', icon: FileText }
    ];
  };

  const getMonthlyData = () => {
    return [
      { month: 'Jan', views: 980, leads: 45, projects: 8, revenue: 85000 },
      { month: 'Fev', views: 1200, leads: 52, projects: 12, revenue: 95000 },
      { month: 'Mar', views: 1100, leads: 48, projects: 10, revenue: 88000 },
      { month: 'Abr', views: 1350, leads: 65, projects: 15, revenue: 125000 },
      { month: 'Mai', views: 1580, leads: 78, projects: 18, revenue: 145000 },
      { month: 'Jun', views: 1420, leads: 89, projects: 16, revenue: 145200 }
    ];
  };

  const handleEdit = () => {
    setEditData(company);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Aqui salvaria os dados editados
    setIsEditing(false);
    setEditData(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const stats = getDashboardStats();
  const recentActivity = getRecentActivity();
  const monthlyData = getMonthlyData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <Building2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Dashboard da Empresa</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
                <Badge className="ml-2 bg-red-500">3</Badge>
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Relatório
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 mx-auto bg-white">
                      <Image
                        src={getCompanyLogo()}
                        alt={company.nome_fantasia}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full p-1"
                      />
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full p-0"
                    >
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{company.nome_fantasia}</h2>
                    <p className="text-sm text-gray-500">CNPJ: {formatCNPJ(company.cnpj)}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">{company.rating}</span>
                    </div>
                    <span className="text-gray-500">({company.total_reviews} avaliações)</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Status Rápido</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Projetos Ativos</span>
                      <Badge variant="secondary">{stats.activeProjects}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Leads Este Mês</span>
                      <Badge className="bg-green-100 text-green-800">{stats.newLeads}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taxa de Conversão</span>
                      <span className="text-sm font-semibold">{stats.conversions}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Satisfação</span>
                      <span className="text-sm font-semibold text-green-600">{stats.clientSatisfaction}%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Ações Rápidas</h3>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Serviço
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Atualizar Galeria
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="servicos">Serviços</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="configuracoes">Config</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Visualizações</p>
                          <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {stats.viewsChange}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Novos Leads</p>
                          <p className="text-2xl font-bold">{stats.newLeads}</p>
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {stats.leadsChange}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Conversões</p>
                          <p className="text-2xl font-bold">{stats.conversions}</p>
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {stats.conversionsChange}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Receita</p>
                          <p className="text-2xl font-bold">{stats.revenue}</p>
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {stats.revenueChange}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Performance Mensal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                          <p className="text-gray-600">Gráfico de Barras</p>
                          <p className="text-sm text-gray-500">Leads, Projetos e Receita</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Distribuição de Serviços
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <PieChart className="w-16 h-16 text-green-400 mx-auto mb-4" />
                          <p className="text-gray-600">Gráfico de Pizza</p>
                          <p className="text-sm text-gray-500">ERP 40%, Mobile 25%, Cloud 20%, Consultoria 15%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Activity Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Atividade Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <activity.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Perfil Tab */}
              <TabsContent value="perfil">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Informações da Empresa</CardTitle>
                    {!isEditing ? (
                      <Button onClick={handleEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                        <Input
                          id="nome_fantasia"
                          value={isEditing ? (editData?.nome_fantasia || '') : company.nome_fantasia}
                          disabled={!isEditing}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, nome_fantasia: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="razao_social">Razão Social</Label>
                        <Input
                          id="razao_social"
                          value={isEditing ? (editData?.razao_social || '') : company.razao_social}
                          disabled={!isEditing}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, razao_social: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_email">E-mail</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={isEditing ? (editData?.contact_email || '') : company.contact_email}
                          disabled={!isEditing}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, contact_email: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_phone">Telefone</Label>
                        <Input
                          id="contact_phone"
                          value={isEditing ? (editData?.contact_phone || '') : company.contact_phone}
                          disabled={!isEditing}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, contact_phone: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={isEditing ? (editData?.website || '') : company.website}
                          disabled={!isEditing}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, website: e.target.value } : null)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição da Empresa</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={isEditing ? (editData?.description || '') : company.description}
                        disabled={!isEditing}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, description: e.target.value } : null)}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Endereço</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="address_street">Rua</Label>
                          <Input
                            id="address_street"
                            value={isEditing ? (editData?.address_street || '') : company.address_street}
                            disabled={!isEditing}
                            onChange={(e) => setEditData(prev => prev ? { ...prev, address_street: e.target.value } : null)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_number">Número</Label>
                          <Input
                            id="address_number"
                            value={isEditing ? (editData?.address_number || '') : company.address_number}
                            disabled={!isEditing}
                            onChange={(e) => setEditData(prev => prev ? { ...prev, address_number: e.target.value } : null)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_city">Cidade</Label>
                          <Input
                            id="address_city"
                            value={isEditing ? (editData?.address_city || '') : company.address_city}
                            disabled={!isEditing}
                            onChange={(e) => setEditData(prev => prev ? { ...prev, address_city: e.target.value } : null)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Serviços Tab */}
              <TabsContent value="servicos">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gerenciar Serviços</CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Serviço
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Desenvolvimento de Software', 'Consultoria ERP', 'Aplicativos Mobile', 'Migração Cloud'].map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{service}</h3>
                            <p className="text-sm text-gray-600">Ativo • Última atualização: há 2 dias</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked />
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="w-5 h-5" />
                        Tendência de Leads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <LineChart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                          <p className="text-gray-600">Gráfico de Linha</p>
                          <p className="text-sm text-gray-500">Crescimento de 23% este mês</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Métricas de Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Taxa de Resposta</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                            <span className="text-sm font-medium">90%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Entrega no Prazo</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                            <span className="text-sm font-medium">95%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Satisfação do Cliente</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                            </div>
                            <span className="text-sm font-medium">98%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Configurações Tab */}
              <TabsContent value="configuracoes">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações da Conta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Notificações por E-mail</h3>
                          <p className="text-sm text-gray-600">Receber notificações sobre novos leads</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Perfil Público</h3>
                          <p className="text-sm text-gray-600">Permitir que clientes vejam seu perfil</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Relatórios Automáticos</h3>
                          <p className="text-sm text-gray-600">Enviar relatório mensal por e-mail</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Horário de Funcionamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <span>Segunda - Sexta</span>
                          <Input defaultValue="08:00" />
                          <Input defaultValue="18:00" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <span>Sábado</span>
                          <Input defaultValue="08:00" />
                          <Input defaultValue="12:00" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <span>Domingo</span>
                          <Input disabled placeholder="Fechado" />
                          <Input disabled placeholder="Fechado" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 