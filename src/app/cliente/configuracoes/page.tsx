'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2, User, Bell, Shield, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

export default function ClienteConfiguracoesPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

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
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando configurações...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="space-y-6">
        {/* Configurações de Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Editar Perfil</h4>
                <p className="text-sm text-muted-foreground">
                  Atualize suas informações pessoais, foto e dados de contato
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => router.push('/cliente/perfil')}
              >
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificações por E-mail</h4>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre agendamentos por e-mail
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificações Push</h4>
                <p className="text-sm text-muted-foreground">
                  Receba notificações instantâneas no navegador
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Lembretes de Agendamento</h4>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes antes dos seus agendamentos
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Ofertas e Promoções</h4>
                <p className="text-sm text-muted-foreground">
                  Receba informações sobre ofertas especiais
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacidade e Segurança
            </CardTitle>
            <CardDescription>
              Gerencie suas configurações de privacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Perfil Público</h4>
                <p className="text-sm text-muted-foreground">
                  Permitir que profissionais vejam seu perfil básico
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Histórico de Avaliações</h4>
                <p className="text-sm text-muted-foreground">
                  Mostrar suas avaliações publicamente
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Alterar Senha</h4>
                <p className="text-sm text-muted-foreground">
                  Atualize sua senha de acesso
                </p>
              </div>
              <Button variant="outline">
                Alterar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Zona de Perigo */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Trash2 className="mr-2 h-5 w-5" />
              Zona de Perigo
            </CardTitle>
            <CardDescription>
              Ações irreversíveis para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Excluir Conta</h4>
                <p className="text-sm text-muted-foreground">
                  Exclua permanentemente sua conta e todos os dados associados
                </p>
              </div>
              <Button variant="destructive">
                Excluir Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 