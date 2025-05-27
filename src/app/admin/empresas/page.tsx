'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  business_type: string;
  plan_type: string;
  email: string;
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  verified: boolean;
  created_at: string;
  company_addresses: Array<{
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
  }>;
  company_contacts: Array<{
    phone: string;
    email: string;
    whatsapp?: string;
    website?: string;
  }>;
  company_business_hours: Array<{
    day: string;
    open: string;
    close: string;
    is_closed: boolean;
  }>;
}

export default function AdminEmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('companies')
        .select(`
          *,
          company_addresses(*),
          company_contacts(*),
          company_business_hours(*)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar empresas:', error);
        toast.error('Erro ao carregar empresas');
        return;
      }

      setCompanies(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyStatus = async (companyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ 
          status: newStatus,
          verified: newStatus === 'active'
        })
        .eq('id', companyId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status da empresa');
        return;
      }

      toast.success(`Empresa ${newStatus === 'active' ? 'aprovada' : 'rejeitada'} com sucesso!`);
      fetchCompanies();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da empresa');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      active: { label: 'Ativa', variant: 'default' as const },
      inactive: { label: 'Inativa', variant: 'outline' as const },
      rejected: { label: 'Rejeitada', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      basic: { label: 'Básico', variant: 'outline' as const },
      pro: { label: 'Pro', variant: 'secondary' as const },
      enterprise: { label: 'Enterprise', variant: 'default' as const },
    };

    const config = planConfig[plan as keyof typeof planConfig] || planConfig.basic;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.includes(searchTerm)
  );

  const formatBusinessHours = (hours: Company['company_business_hours']) => {
    if (!hours || hours.length === 0) return 'Não informado';
    
    const dayNames = {
      monday: 'Seg',
      tuesday: 'Ter',
      wednesday: 'Qua',
      thursday: 'Qui',
      friday: 'Sex',
      saturday: 'Sáb',
      sunday: 'Dom'
    };

    return hours
      .filter(h => !h.is_closed)
      .map(h => `${dayNames[h.day as keyof typeof dayNames]}: ${h.open}-${h.close}`)
      .join(', ');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Empresas</h1>
          <p className="text-gray-600 mt-2">
            Visualize e gerencie todas as empresas cadastradas na plataforma
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="inactive">Inativa</SelectItem>
                <SelectItem value="rejected">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Empresas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Empresas Cadastradas ({filteredCompanies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando empresas...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma empresa encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-gray-500">
                          {company.business_type}
                        </div>
                        {company.cnpj && (
                          <div className="text-xs text-gray-400">
                            CNPJ: {company.cnpj}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {company.email}
                        </div>
                        {company.company_contacts[0]?.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {company.company_contacts[0].phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.company_addresses[0] ? (
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.company_addresses[0].city}, {company.company_addresses[0].state}
                          </div>
                          <div className="text-xs text-gray-500">
                            {company.company_addresses[0].neighborhood}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getPlanBadge(company.plan_type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(company.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(company.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCompany(company)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Empresa</DialogTitle>
                              <DialogDescription>
                                Informações completas da empresa
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCompany && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Informações Básicas</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Nome:</strong> {selectedCompany.name}</p>
                                      <p><strong>CNPJ:</strong> {selectedCompany.cnpj || 'Não informado'}</p>
                                      <p><strong>Tipo:</strong> {selectedCompany.business_type}</p>
                                      <p><strong>Plano:</strong> {selectedCompany.plan_type}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Contato</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Email:</strong> {selectedCompany.email}</p>
                                      {selectedCompany.company_contacts[0]?.phone && (
                                        <p><strong>Telefone:</strong> {selectedCompany.company_contacts[0].phone}</p>
                                      )}
                                      {selectedCompany.company_contacts[0]?.whatsapp && (
                                        <p><strong>WhatsApp:</strong> {selectedCompany.company_contacts[0].whatsapp}</p>
                                      )}
                                      {selectedCompany.company_contacts[0]?.website && (
                                        <p><strong>Website:</strong> {selectedCompany.company_contacts[0].website}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {selectedCompany.company_addresses[0] && (
                                  <div>
                                    <h4 className="font-medium mb-2">Endereço</h4>
                                    <div className="text-sm">
                                      <p>
                                        {selectedCompany.company_addresses[0].street}, {selectedCompany.company_addresses[0].number}
                                        {selectedCompany.company_addresses[0].complement && `, ${selectedCompany.company_addresses[0].complement}`}
                                      </p>
                                      <p>
                                        {selectedCompany.company_addresses[0].neighborhood}, {selectedCompany.company_addresses[0].city} - {selectedCompany.company_addresses[0].state}
                                      </p>
                                      <p>CEP: {selectedCompany.company_addresses[0].postal_code}</p>
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <h4 className="font-medium mb-2">Horário de Funcionamento</h4>
                                  <div className="text-sm">
                                    {formatBusinessHours(selectedCompany.company_business_hours)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {company.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCompanyStatus(company.id, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCompanyStatus(company.id, 'rejected')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 