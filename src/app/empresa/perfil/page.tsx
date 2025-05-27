'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Camera, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'

interface CompanyProfile {
  id: string
  name: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postal_code: string
  website?: string
  avatar_url?: string
  cover_url?: string
  business_hours?: any
  specialties?: string[]
  status: string
  verified: boolean
  created_at: string
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  active: boolean
}

interface Quote {
  id: string
  client_name: string
  client_email: string
  service_name: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  estimated_value?: number
  created_at: string
}

export default function BusinessProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('perfil')
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showServiceDialog, setShowServiceDialog] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!user) {
      router.push('/entrar')
      return
    }
    
    // Verificar se é empresa
    if (user.user_metadata?.role !== 'company') {
      toast.error('Acesso negado. Esta área é exclusiva para empresas.')
      router.push('/entrar')
      return
    }

    loadData()
  }, [user, router])

  const loadData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Carregar perfil da empresa
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      // Carregar serviços
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('company_id', user.id)
        .order('created_at', { ascending: false })

      if (servicesError && servicesError.code !== 'PGRST116') {
        console.error('Erro ao carregar serviços:', servicesError)
      }

      // Carregar orçamentos
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false })

      if (quotesError && quotesError.code !== 'PGRST116') {
        console.error('Erro ao carregar orçamentos:', quotesError)
      }

      setProfile(profileData)
      setServices(servicesData || [])
      setQuotes(quotesData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile || !user) return

    try {
      setIsSaving(true)

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          description: profile.description,
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          postal_code: profile.postal_code,
          website: profile.website,
          business_hours: profile.business_hours,
          specialties: profile.specialties,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
    if (!user || !profile) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${type}-${Date.now()}.${fileExt}`
      const filePath = `${type}s/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('company-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('company-images')
        .getPublicUrl(filePath)

      const updateField = type === 'avatar' ? 'avatar_url' : 'cover_url'
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile({ ...profile, [updateField]: publicUrl })
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Capa'} atualizada com sucesso!`)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload da imagem')
    }
  }

  const handleSaveService = async (serviceData: Partial<Service>) => {
    if (!user) return

    try {
      if (editingService) {
        // Atualizar serviço existente
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id)

        if (error) throw error
        toast.success('Serviço atualizado com sucesso!')
      } else {
        // Criar novo serviço
        const { error } = await supabase
          .from('services')
          .insert({
            ...serviceData,
            company_id: user.id
          })

        if (error) throw error
        toast.success('Serviço criado com sucesso!')
      }

      setShowServiceDialog(false)
      setEditingService(null)
      loadData()
    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      toast.error('Erro ao salvar serviço')
    }
  }

  const handleQuoteAction = async (quoteId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: action })
        .eq('id', quoteId)

      if (error) throw error

      toast.success(`Orçamento ${action === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`)
      loadData()
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error)
      toast.error('Erro ao atualizar orçamento')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Perfil não encontrado</h2>
          <Button onClick={() => router.push('/entrar')}>Voltar ao Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com capa e avatar */}
      <div className="relative">
        {/* Capa de fundo */}
        <div 
          className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative"
          style={{
            backgroundImage: profile.cover_url ? `url(${profile.cover_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          
          {/* Botão para alterar capa */}
          <div className="absolute top-4 right-4">
            <label htmlFor="cover-upload" className="cursor-pointer">
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30">
                <Camera className="h-4 w-4 mr-2" />
                Alterar Capa
              </Button>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'cover')
                }}
              />
            </label>
          </div>
        </div>

        {/* Avatar e informações básicas */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Botão para alterar avatar */}
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                <Button size="sm" className="rounded-full h-8 w-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'avatar')
                  }}
                />
              </label>
            </div>

            {/* Informações da empresa */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                {profile.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificada
                  </Badge>
                )}
                <Badge variant={profile.status === 'approved' ? 'default' : 'secondary'}>
                  {profile.status === 'approved' ? 'Ativa' : 'Pendente'}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4 max-w-2xl">{profile.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {profile.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.address}, {profile.city} - {profile.state}
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Botão de editar */}
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Aba Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Gerencie as informações básicas da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website || ''}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      disabled={!isEditing}
                      placeholder="https://www.exemplo.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    disabled={!isEditing}
                    className="min-h-[100px]"
                    placeholder="Descreva sua empresa, serviços e diferenciais..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Serviços */}
          <TabsContent value="servicos" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Meus Serviços</h2>
                <p className="text-gray-600">Gerencie os serviços oferecidos pela sua empresa</p>
              </div>
              <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingService(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Serviço
                  </Button>
                </DialogTrigger>
                <ServiceDialog
                  service={editingService}
                  onSave={handleSaveService}
                  onClose={() => {
                    setShowServiceDialog(false)
                    setEditingService(null)
                  }}
                />
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.category}</CardDescription>
                      </div>
                      <Badge variant={service.active ? 'default' : 'secondary'}>
                        {service.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">R$ {service.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration}min</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setEditingService(service)
                        setShowServiceDialog(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {services.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Users className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum serviço cadastrado</h3>
                  <p className="text-gray-600 mb-4">
                    Comece cadastrando os serviços que sua empresa oferece
                  </p>
                  <Button onClick={() => setShowServiceDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Serviço
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba Orçamentos */}
          <TabsContent value="orcamentos" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Orçamentos Solicitados</h2>
              <p className="text-gray-600">Gerencie os orçamentos solicitados pelos clientes</p>
            </div>

            <div className="space-y-4">
              {quotes.map((quote) => (
                <Card key={quote.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{quote.service_name}</h3>
                        <p className="text-gray-600">Cliente: {quote.client_name}</p>
                        <p className="text-sm text-gray-500">{quote.client_email}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            quote.status === 'approved' ? 'default' : 
                            quote.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {quote.status === 'approved' ? 'Aprovado' : 
                           quote.status === 'rejected' ? 'Rejeitado' : 
                           'Pendente'}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{quote.description}</p>

                    {quote.estimated_value && (
                      <div className="flex items-center gap-1 text-green-600 mb-4">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">R$ {quote.estimated_value}</span>
                      </div>
                    )}

                    {quote.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleQuoteAction(quote.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleQuoteAction(quote.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {quotes.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum orçamento solicitado</h3>
                  <p className="text-gray-600">
                    Os orçamentos solicitados pelos clientes aparecerão aqui
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics</h2>
              <p className="text-gray-600">Acompanhe o desempenho da sua empresa</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Serviços</p>
                      <p className="text-2xl font-bold">{services.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Orçamentos Pendentes</p>
                      <p className="text-2xl font-bold">
                        {quotes.filter(q => q.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Orçamentos Aprovados</p>
                      <p className="text-2xl font-bold">
                        {quotes.filter(q => q.status === 'approved').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                      <p className="text-2xl font-bold">
                        {quotes.length > 0 
                          ? Math.round((quotes.filter(q => q.status === 'approved').length / quotes.length) * 100)
                          : 0}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumo da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Data de Cadastro</span>
                    <span className="font-medium">
                      {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Status da Conta</span>
                    <Badge variant={profile.status === 'approved' ? 'default' : 'secondary'}>
                      {profile.status === 'approved' ? 'Aprovada' : 'Pendente'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Verificação</span>
                    <Badge variant={profile.verified ? 'default' : 'secondary'}>
                      {profile.verified ? 'Verificada' : 'Não Verificada'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Especialidades</span>
                    <span className="font-medium">
                      {profile.specialties?.length || 0} cadastradas
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Componente para o diálogo de serviços
function ServiceDialog({ 
  service, 
  onSave, 
  onClose 
}: { 
  service: Service | null
  onSave: (data: Partial<Service>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || 0,
    duration: service?.duration || 60,
    category: service?.category || '',
    active: service?.active ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {service ? 'Editar Serviço' : 'Novo Serviço'}
        </DialogTitle>
        <DialogDescription>
          {service ? 'Edite as informações do serviço' : 'Cadastre um novo serviço'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="service-name">Nome do Serviço</Label>
          <Input
            id="service-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-category">Categoria</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="consultoria">Consultoria</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-description">Descrição</Label>
          <Textarea
            id="service-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="service-price">Preço (R$)</Label>
            <Input
              id="service-price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-duration">Duração (min)</Label>
            <Input
              id="service-duration"
              type="number"
              min="15"
              step="15"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="service-active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          />
          <Label htmlFor="service-active">Serviço ativo</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {service ? 'Atualizar' : 'Criar'} Serviço
          </Button>
        </div>
      </form>
    </DialogContent>
  )
} 