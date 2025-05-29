'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Check } from 'lucide-react'

type Step = 'plans' | 'location' | 'business' | 'personal' | 'email'

interface FormData {
  // Dados da empresa
  name: string
  cnpj: string
  business_type: string
  plan_type: 'basic' | 'pro' | 'enterprise'
  email: string
  password: string
  
  // Endereço
  postal_code: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  
  // Contato
  phone: string
  whatsapp: string
  website: string
  
  // Horário de funcionamento
  business_hours: {
    day: string
    open: string
    close: string
    is_closed: boolean
  }[]
}

const BUSINESS_TYPES = [
  'Salão de Beleza',
  'Barbearia',
  'Estética',
  'Pet Shop',
  'Oficina Mecânica',
  'Consultório Médico',
  'Consultório Odontológico',
  'Outros'
]

const DAYS_OF_WEEK = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
]

export function CadastroEmpresaForm() {
  const [currentStep, setCurrentStep] = useState<Step>('plans')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cnpj: '',
    business_type: '',
    plan_type: 'basic',
    email: '',
    password: '',
    postal_code: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    phone: '',
    whatsapp: '',
    website: '',
    business_hours: DAYS_OF_WEEK.map(day => ({
      day,
      open: '09:00',
      close: '18:00',
      is_closed: false
    }))
  })
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    const steps: Step[] = ['plans', 'location', 'business', 'personal', 'email']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: Step[] = ['plans', 'location', 'business', 'personal', 'email']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }
    
    try {
      setLoading(true)

      // Enviar dados para a API de cadastro
      const response = await fetch('/api/companies/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Erro ao realizar cadastro')
        return
      }

      if (result.success) {
        toast.success(result.message)
        router.push('/empresas/login?message=cadastro-realizado')
      } else {
        toast.error('Erro inesperado ao realizar cadastro')
      }
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error)
      toast.error('Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'plans':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Escolha seu plano</h2>
              <p className="text-gray-500 mt-2">
                Selecione o plano que melhor atende às suas necessidades
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plano Basic */}
              <Card className={`p-6 cursor-pointer transition-all ${
                formData.plan_type === 'basic' ? 'ring-2 ring-primary' : ''
              }`} onClick={() => handleInputChange('plan_type', 'basic')}>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Basic</h3>
                  <p className="text-3xl font-bold mt-2">R$ 0</p>
                  <p className="text-gray-500 mt-1">por mês</p>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Até 5 serviços</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Perfil básico</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Suporte por email</span>
                  </li>
                </ul>
              </Card>

              {/* Plano Pro */}
              <Card className={`p-6 cursor-pointer transition-all ${
                formData.plan_type === 'pro' ? 'ring-2 ring-primary' : ''
              }`} onClick={() => handleInputChange('plan_type', 'pro')}>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Pro</h3>
                  <p className="text-3xl font-bold mt-2">R$ 49</p>
                  <p className="text-gray-500 mt-1">por mês</p>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Serviços ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Perfil destacado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
              </Card>

              {/* Plano Enterprise */}
              <Card className={`p-6 cursor-pointer transition-all ${
                formData.plan_type === 'enterprise' ? 'ring-2 ring-primary' : ''
              }`} onClick={() => handleInputChange('plan_type', 'enterprise')}>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Enterprise</h3>
                  <p className="text-3xl font-bold mt-2">R$ 99</p>
                  <p className="text-gray-500 mt-1">por mês</p>
                </div>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Tudo do plano Pro</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>API personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Gerente dedicado</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Localização</h2>
              <p className="text-gray-500 mt-2">
                Informe o endereço da sua empresa
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="postal_code">CEP</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="00000-000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Nome da rua"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) => handleInputChange('complement', e.target.value)}
                    placeholder="Sala 123"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Nome do bairro"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Nome da cidade"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="UF"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Dados do Negócio</h2>
              <p className="text-gray-500 mt-2">
                Informe os dados da sua empresa
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome fantasia"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="business_type">Tipo de Negócio</Label>
                <Select
                  value={formData.business_type}
                  onValueChange={(value) => handleInputChange('business_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de negócio" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Horário de Funcionamento</Label>
                <div className="space-y-4 mt-2">
                  {formData.business_hours.map((hour, index) => (
                    <div key={hour.day} className="grid grid-cols-4 gap-4 items-center">
                      <div className="col-span-1">
                        <span>{hour.day}</span>
                      </div>
                      <div className="col-span-3 grid grid-cols-2 gap-4">
                        <Input
                          type="time"
                          value={hour.open}
                          onChange={(e) => {
                            const newHours = [...formData.business_hours]
                            newHours[index] = {
                              ...hour,
                              open: e.target.value
                            }
                            handleInputChange('business_hours', newHours)
                          }}
                          disabled={hour.is_closed}
                        />
                        <Input
                          type="time"
                          value={hour.close}
                          onChange={(e) => {
                            const newHours = [...formData.business_hours]
                            newHours[index] = {
                              ...hour,
                              close: e.target.value
                            }
                            handleInputChange('business_hours', newHours)
                          }}
                          disabled={hour.is_closed}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'personal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Dados de Contato</h2>
              <p className="text-gray-500 mt-2">
                Informe os dados de contato da empresa
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(00) 0000-0000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.exemplo.com.br"
                />
              </div>
            </div>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Dados de Acesso</h2>
              <p className="text-gray-500 mt-2">
                Informe seu e-mail e senha para acesso à plataforma
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Mínimo de 6 caracteres
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <Link href="/" className="flex items-center">
          <Image src="/contratto-logo.png" alt="Contratto" width={150} height={40} priority />
        </Link>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'plans'}
            >
              Voltar
            </Button>

            {currentStep === 'email' ? (
              <Button type="submit" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Próximo
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
} 