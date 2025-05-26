import { Metadata } from 'next'
import { SidebarNav } from '@/components/SidebarNav'

export const metadata: Metadata = {
  title: 'Área da Empresa - iServiços',
  description: 'Gerencie sua empresa, serviços e profissionais.',
}

const sidebarNavItems = [
  {
    title: 'Visão Geral',
    href: '/empresa/[id]',
    icon: 'home',
  },
  {
    title: 'Analytics',
    href: '/empresa/[id]/analytics',
    icon: 'chart',
  },
  {
    title: 'Clientes',
    href: '/empresa/[id]/clientes',
    icon: 'users',
  },
  {
    title: 'Profissionais',
    href: '/empresa/[id]/profissionais',
    icon: 'briefcase',
  },
  {
    title: 'Serviços',
    href: '/empresa/[id]/servicos',
    icon: 'scissors',
  },
  {
    title: 'Agendamentos',
    href: '/empresa/[id]/agendamentos',
    icon: 'calendar',
  },
  {
    title: 'Configurações',
    href: '/empresa/[id]/configuracoes',
    icon: 'settings',
  },
]

interface LayoutProps {
  children: React.ReactNode
  params: { id: string }
}

export default function Layout({ children, params }: LayoutProps) {
  const items = sidebarNavItems.map((item) => ({
    ...item,
    href: item.href.replace('[id]', params.id),
  }))

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <SidebarNav items={items} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
} 