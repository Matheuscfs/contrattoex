'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, User, Mail, Phone, Calendar, MapPin, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface EditableProfile {
  name: string
  phone: string
  cpf: string
  birth_date: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  } | null
}

export default function ClientePerfilPage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editableProfile, setEditableProfile] = useState<EditableProfile>({
    name: '',
    phone: '',
    cpf: '',
    birth_date: '',
    address: null
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/entrar')
        return
      }

      // Verificar se o usuário é realmente um cliente
      const userRole = profile?.role || user.user_metadata?.role
      if (userRole !== 'customer') {
        // Se não é cliente, redirecionar para o dashboard correto
        router.push('/dashboard')
        return
      }

      // Inicializar dados editáveis
      setEditableProfile({
        name: profile?.name || user.user_metadata?.name || '',
        phone: profile?.phone || '',
        cpf: profile?.cpf || '',
        birth_date: profile?.birth_date ? profile.birth_date.split('T')[0] : '',
        address: profile?.address ? {
          street: profile.address.street || '',
          number: profile.address.number || '',
          complement: profile.address.complement || '',
          neighborhood: profile.address.neighborhood || '',
          city: profile.address.city || '',
          state: profile.address.state || '',
          zipCode: profile.address.zipCode || ''
        } : {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        }
      })
    }
  }, [user, profile, loading, router])

  const handleSave = async () => {
    if (!user || !profile) return

    try {
      setIsSaving(true)

      console.log('=== DEBUG: Iniciando salvamento ===')
      console.log('User ID:', user.id)

      // Atualizar apenas campos básicos (sem endereço por enquanto)
      const updateData = {
        name: editableProfile.name,
        phone: editableProfile.phone || null,
        cpf: editableProfile.cpf || null,
        birth_date: editableProfile.birth_date || null
      }

      console.log('Dados a serem salvos:', updateData)

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()

      console.log('=== DEBUG: Resposta do Supabase ===')
      console.log('Data:', data)
      console.log('Error:', error)

      if (error) throw error

      // Atualizar contexto
      await refreshProfile()
      
      setIsEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('=== DEBUG: Erro completo ===', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      toast.error(`Erro ao atualizar perfil: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Restaurar dados originais
    setEditableProfile({
      name: profile?.name || user?.user_metadata?.name || '',
      phone: profile?.phone || '',
      cpf: profile?.cpf || '',
      birth_date: profile?.birth_date ? profile.birth_date.split('T')[0] : '',
      address: profile?.address || {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      }
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando perfil...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userInitials = (profile?.name || user.user_metadata?.name || user.email || '')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Não informado'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card do Avatar e Informações Básicas */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                  alt={profile?.name || user.user_metadata?.name || 'Cliente'} 
                />
                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {profile?.name || user.user_metadata?.name || 'Cliente'}
            </CardTitle>
            <CardDescription>
              <Badge variant="secondary">Cliente</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="w-full"
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={handleSave}
                  className="w-full"
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button 
                  onClick={handleCancel}
                  className="w-full"
                  variant="outline"
                  disabled={isSaving}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Informações Pessoais */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditing ? (
              // Modo visualização
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                  <div className="flex items-center mt-1">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  <div className="flex items-center mt-1">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{profile?.phone || 'Não informado'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">CPF</label>
                  <div className="flex items-center mt-1">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{profile?.cpf || 'Não informado'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(profile?.birth_date)}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Modo edição
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={editableProfile.name}
                    onChange={(e) => setEditableProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editableProfile.phone}
                    onChange={(e) => setEditableProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={editableProfile.cpf}
                    onChange={(e) => setEditableProfile(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={editableProfile.birth_date}
                    onChange={(e) => setEditableProfile(prev => ({ ...prev, birth_date: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Endereço - Temporariamente desabilitado */}
            {/*
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Endereço
              </h3>
              
              {!isEditing ? (
                // Visualização do endereço
                profile?.address ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{profile.address.street}, {profile.address.number}</p>
                    {profile.address.complement && <p>{profile.address.complement}</p>}
                    <p>{profile.address.neighborhood}</p>
                    <p>{profile.address.city} - {profile.address.state}</p>
                    <p>CEP: {profile.address.zipCode}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Endereço não informado</p>
                )
              ) : (
                // Edição do endereço
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={editableProfile.address?.street || ''}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        address: { ...prev.address!, street: e.target.value }
                      }))}
                      placeholder="Nome da rua"
                    />
                  </div>

                  <div>
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={editableProfile.address?.number || ''}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        address: { ...prev.address!, number: e.target.value }
                      }))}
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={editableProfile.address?.complement || ''}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        address: { ...prev.address!, complement: e.target.value }
                      }))}
                      placeholder="Apto, bloco, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={editableProfile.address?.neighborhood || ''}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        address: { ...prev.address!, neighborhood: e.target.value }
                      }))}
                      placeholder="Nome do bairro"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={editableProfile.address?.city || ''}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        address: { ...prev.address!, city: e.target.value }
                      }))}
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={editableProfile.address?.state || ''}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        address: { ...prev.address!, state: e.target.value }
                      }))}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={editableProfile.address?.zipCode || ''}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        address: { ...prev.address!, zipCode: e.target.value }
                      }))}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              )}
            </div>
            */}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      {!isEditing && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button 
                onClick={() => router.push('/cliente/agendamentos')}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Calendar className="h-6 w-6" />
                <span>Meus Agendamentos</span>
              </Button>

              <Button 
                onClick={() => router.push('/cliente/favoritos')}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <User className="h-6 w-6" />
                <span>Favoritos</span>
              </Button>

              <Button 
                onClick={() => router.push('/cliente/avaliacoes')}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <User className="h-6 w-6" />
                <span>Minhas Avaliações</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 