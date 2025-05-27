import { Suspense } from 'react'
import { CompanyList } from '@/components/company/CompanyList'
import { CompanyFilters } from '@/components/company/CompanyFilters'
import { CompanySearch } from '@/components/company/CompanySearch'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export const metadata = {
  title: 'Empresas | iServiços',
  description: 'Encontre os melhores prestadores de serviços perto de você'
}

export default function EmpresasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/aperto-de-mao.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Content */}
        <div className="container px-4 md:px-6 relative z-20">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              Expanda seu Negócio com o iServiços
            </h1>
            <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
              Conecte-se com mais clientes, gerencie seus agendamentos e aumente sua receita com nossa plataforma completa.
            </p>
            <div className="space-x-4">
              <Link href="/empresas/cadastro">
                <Button size="lg" className="font-medium">
                  Comece Agora Gratuitamente
                </Button>
              </Link>
              <Link href="#planos">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Ver Planos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o iServiços?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Gestão Simplificada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Dashboard intuitivo para gerenciar agendamentos, clientes e serviços em um só lugar.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mais Visibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Apareça para clientes em busca de serviços na sua região e aumente sua base de clientes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Facilitados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Receba pagamentos online de forma segura e gerencie seu fluxo de caixa com facilidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Escolha o Plano Ideal para Você</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano Básico */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <p className="text-2xl font-bold">R$ 0/mês</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Até 30 agendamentos/mês</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Perfil básico da empresa</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Suporte por email</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Começar Grátis</Button>
              </CardContent>
            </Card>

            {/* Plano Pro */}
            <Card className="relative border-primary">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                Mais Popular
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <p className="text-2xl font-bold">R$ 99/mês</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Agendamentos ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Perfil destacado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Relatórios avançados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Assinar Pro</Button>
              </CardContent>
            </Card>

            {/* Plano Premium */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <p className="text-2xl font-bold">R$ 199/mês</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Tudo do plano Pro</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>API personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Gerente de conta dedicado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Personalização avançada</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Contato Comercial</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Cadastre-se</h3>
              <p className="text-gray-500">Crie sua conta gratuitamente e configure seu perfil</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Adicione Serviços</h3>
              <p className="text-gray-500">Cadastre seus serviços, preços e disponibilidade</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Receba Agendamentos</h3>
              <p className="text-gray-500">Clientes podem agendar e pagar online</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Gerencie seu Negócio</h3>
              <p className="text-gray-500">Acompanhe métricas e cresça com nossa plataforma</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold">Comece a Crescer Hoje Mesmo</h2>
            <p className="max-w-[600px] text-white/90">
              Junte-se a milhares de empresas que já estão crescendo com o iServiços
            </p>
            <Link href="/cadastro/profissional-empresa">
              <Button size="lg" variant="secondary" className="font-medium">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 