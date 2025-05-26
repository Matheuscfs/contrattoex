'use client'

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { CompanySettings } from "@/types/company-settings"
import { maskCNPJ, maskCPF, maskPhone, maskCEP } from "@/utils/masks"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogoUpload } from '@/components/company/LogoUpload'

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<CompanySettings | null>(null)
  const [loading, setLoading] = React.useState(true)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  React.useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error

      setSettings(data)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    try {
      const formData = new FormData(event.currentTarget)
      const updatedSettings: CompanySettings = {
        id: settings?.id || '',
        user_id: user?.id || '',
        created_at: settings?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        
        ...settings,
        
        logo_url: settings?.logo_url || null,
        cnpj: maskCNPJ(formData.get('cnpj') as string),
        razao_social: formData.get('razao_social') as string,
        inscricao_estadual: formData.get('inscricao_estadual') as string,
        responsible_name: formData.get('responsible_name') as string,
        responsible_cpf: maskCPF(formData.get('responsible_cpf') as string),
        website: formData.get('website') as string,
        description: formData.get('description') as string,

        address_street: formData.get('address_street') as string,
        address_number: formData.get('address_number') as string,
        address_complement: formData.get('address_complement') as string,
        address_neighborhood: formData.get('address_neighborhood') as string,
        address_city: formData.get('address_city') as string,
        address_state: formData.get('address_state') as string,
        address_zip_code: maskCEP(formData.get('address_zip_code') as string),

        contact_phone: maskPhone(formData.get('contact_phone') as string),
        contact_email: formData.get('contact_email') as string,
        contact_whatsapp: maskPhone(formData.get('contact_whatsapp') as string),

        notification_settings: {
          ...settings?.notification_settings,
          email: {
            enabled: formData.get('notification_email') === 'on',
            frequency: (formData.get('notification_email_frequency') as 'instant' | 'daily' | 'weekly') || settings?.notification_settings.email.frequency || 'instant',
            types: Array.from(formData.getAll('notification_email_types')) as string[] || settings?.notification_settings.email.types || []
          },
          sms: {
            enabled: formData.get('notification_sms') === 'on',
            frequency: (formData.get('notification_sms_frequency') as 'instant' | 'daily' | 'weekly') || settings?.notification_settings.sms.frequency || 'instant',
            types: Array.from(formData.getAll('notification_sms_types')) as string[] || settings?.notification_settings.sms.types || []
          },
          whatsapp: {
            enabled: formData.get('notification_whatsapp') === 'on',
            frequency: (formData.get('notification_whatsapp_frequency') as 'instant' | 'daily' | 'weekly') || settings?.notification_settings.whatsapp.frequency || 'instant',
            types: Array.from(formData.getAll('notification_whatsapp_types')) as string[] || settings?.notification_settings.whatsapp.types || []
          }
        },

        business_hours: {
          ...settings?.business_hours,
          weekdays: {
            start: (formData.get('weekdays_start') as string) || settings?.business_hours.weekdays.start || '',
            end: (formData.get('weekdays_end') as string) || settings?.business_hours.weekdays.end || '',
            enabled: formData.get('weekdays_enabled') === 'on'
          },
          saturday: {
            start: (formData.get('saturday_start') as string) || settings?.business_hours.saturday.start || '',
            end: (formData.get('saturday_end') as string) || settings?.business_hours.saturday.end || '',
            enabled: formData.get('saturday_enabled') === 'on'
          },
          sunday: {
            start: (formData.get('sunday_start') as string) || settings?.business_hours.sunday.start || '',
            end: (formData.get('sunday_end') as string) || settings?.business_hours.sunday.end || '',
            enabled: formData.get('sunday_enabled') === 'on'
          },
          holidays: {
            enabled: formData.get('holidays_enabled') === 'on'
          },
          exceptions: settings?.business_hours.exceptions || []
        }
      }

      const { error } = await supabase
        .from('company_settings')
        .upsert(updatedSettings)

      if (error) throw error

      setSettings(updatedSettings)
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    }
  }

  if (loading) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do seu negócio
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="contato">Contato</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <TabsContent value="geral">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Empresa</CardTitle>
                  <CardDescription>
                    Configure as informações básicas do seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <LogoUpload
                      currentLogo={settings?.logo_url}
                      onUploadComplete={(url) => {
                        setSettings(prev => prev ? {
                          ...prev,
                          logo_url: url
                        } : null)
                      }}
                    />
                    <div className="grid gap-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        defaultValue={settings?.cnpj || ''}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="razao_social">Razão Social</Label>
                      <Input
                        id="razao_social"
                        name="razao_social"
                        defaultValue={settings?.razao_social || ''}
                        placeholder="Nome oficial da empresa"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                      <Input
                        id="inscricao_estadual"
                        name="inscricao_estadual"
                        defaultValue={settings?.inscricao_estadual || ''}
                        placeholder="Número da Inscrição Estadual"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="responsible_name">Nome do Responsável</Label>
                      <Input
                        id="responsible_name"
                        name="responsible_name"
                        defaultValue={settings?.responsible_name || ''}
                        placeholder="Nome completo do responsável"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="responsible_cpf">CPF do Responsável</Label>
                      <Input
                        id="responsible_cpf"
                        name="responsible_cpf"
                        defaultValue={settings?.responsible_cpf || ''}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        defaultValue={settings?.website || ''}
                        placeholder="www.suaempresa.com.br"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={settings?.description || ''}
                        placeholder="Descreva sua empresa"
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endereco">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>
                    Configure o endereço da sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address_street">Rua</Label>
                      <Input
                        id="address_street"
                        name="address_street"
                        defaultValue={settings?.address_street || ''}
                        placeholder="Nome da rua"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="address_number">Número</Label>
                        <Input
                          id="address_number"
                          name="address_number"
                          defaultValue={settings?.address_number || ''}
                          placeholder="Número"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address_complement">Complemento</Label>
                        <Input
                          id="address_complement"
                          name="address_complement"
                          defaultValue={settings?.address_complement || ''}
                          placeholder="Complemento"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address_neighborhood">Bairro</Label>
                      <Input
                        id="address_neighborhood"
                        name="address_neighborhood"
                        defaultValue={settings?.address_neighborhood || ''}
                        placeholder="Nome do bairro"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="address_city">Cidade</Label>
                        <Input
                          id="address_city"
                          name="address_city"
                          defaultValue={settings?.address_city || ''}
                          placeholder="Nome da cidade"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address_state">Estado</Label>
                        <Input
                          id="address_state"
                          name="address_state"
                          defaultValue={settings?.address_state || ''}
                          placeholder="UF"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address_zip_code">CEP</Label>
                      <Input
                        id="address_zip_code"
                        name="address_zip_code"
                        defaultValue={settings?.address_zip_code || ''}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contato">
              <Card>
                <CardHeader>
                  <CardTitle>Contato</CardTitle>
                  <CardDescription>
                    Configure as informações de contato da sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="contact_phone">Telefone</Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        defaultValue={settings?.contact_phone || ''}
                        placeholder="(00) 0000-0000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact_email">E-mail</Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        defaultValue={settings?.contact_email || ''}
                        placeholder="contato@suaempresa.com.br"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact_whatsapp">WhatsApp</Label>
                      <Input
                        id="contact_whatsapp"
                        name="contact_whatsapp"
                        defaultValue={settings?.contact_whatsapp || ''}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Configure como deseja receber as notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notification_email">E-mail</Label>
                        <Switch
                          id="notification_email"
                          name="notification_email"
                          defaultChecked={settings?.notification_settings.email.enabled}
                        />
                      </div>
                      <div className="pl-6 space-y-4">
                        <div className="grid gap-2">
                          <Label>Frequência</Label>
                          <Select name="notification_email_frequency" defaultValue={settings?.notification_settings.email.frequency}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instant">Instantâneo</SelectItem>
                              <SelectItem value="daily">Diário</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notification_sms">SMS</Label>
                        <Switch
                          id="notification_sms"
                          name="notification_sms"
                          defaultChecked={settings?.notification_settings.sms.enabled}
                        />
                      </div>
                      <div className="pl-6 space-y-4">
                        <div className="grid gap-2">
                          <Label>Frequência</Label>
                          <Select name="notification_sms_frequency" defaultValue={settings?.notification_settings.sms.frequency}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instant">Instantâneo</SelectItem>
                              <SelectItem value="daily">Diário</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notification_whatsapp">WhatsApp</Label>
                        <Switch
                          id="notification_whatsapp"
                          name="notification_whatsapp"
                          defaultChecked={settings?.notification_settings.whatsapp.enabled}
                        />
                      </div>
                      <div className="pl-6 space-y-4">
                        <div className="grid gap-2">
                          <Label>Frequência</Label>
                          <Select name="notification_whatsapp_frequency" defaultValue={settings?.notification_settings.whatsapp.frequency}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instant">Instantâneo</SelectItem>
                              <SelectItem value="daily">Diário</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="horarios">
              <Card>
                <CardHeader>
                  <CardTitle>Horários de Funcionamento</CardTitle>
                  <CardDescription>
                    Configure os horários de atendimento da sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Dias úteis</Label>
                        <Switch
                          id="weekdays_enabled"
                          name="weekdays_enabled"
                          defaultChecked={settings?.business_hours.weekdays.enabled}
                        />
                      </div>
                      <div className="pl-6 grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="weekdays_start">Abertura</Label>
                          <Input
                            id="weekdays_start"
                            name="weekdays_start"
                            type="time"
                            defaultValue={settings?.business_hours.weekdays.start}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="weekdays_end">Fechamento</Label>
                          <Input
                            id="weekdays_end"
                            name="weekdays_end"
                            type="time"
                            defaultValue={settings?.business_hours.weekdays.end}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Sábado</Label>
                        <Switch
                          id="saturday_enabled"
                          name="saturday_enabled"
                          defaultChecked={settings?.business_hours.saturday.enabled}
                        />
                      </div>
                      <div className="pl-6 grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="saturday_start">Abertura</Label>
                          <Input
                            id="saturday_start"
                            name="saturday_start"
                            type="time"
                            defaultValue={settings?.business_hours.saturday.start}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="saturday_end">Fechamento</Label>
                          <Input
                            id="saturday_end"
                            name="saturday_end"
                            type="time"
                            defaultValue={settings?.business_hours.saturday.end}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Domingo</Label>
                        <Switch
                          id="sunday_enabled"
                          name="sunday_enabled"
                          defaultChecked={settings?.business_hours.sunday.enabled}
                        />
                      </div>
                      <div className="pl-6 grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="sunday_start">Abertura</Label>
                          <Input
                            id="sunday_start"
                            name="sunday_start"
                            type="time"
                            defaultValue={settings?.business_hours.sunday.start}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="sunday_end">Fechamento</Label>
                          <Input
                            id="sunday_end"
                            name="sunday_end"
                            type="time"
                            defaultValue={settings?.business_hours.sunday.end}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Feriados</Label>
                      <Switch
                        id="holidays_enabled"
                        name="holidays_enabled"
                        defaultChecked={settings?.business_hours.holidays.enabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end space-x-2 mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </Tabs>
      </form>
    </div>
  )
} 