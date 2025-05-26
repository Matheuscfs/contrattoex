import { ReactNode } from 'react'
import { Building2, Settings, User } from 'lucide-react'
import Link from 'next/link'

interface SidebarItemProps {
  href: string
  icon: ReactNode
  children: ReactNode
}

function SidebarItem({ href, icon, children }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
    >
      {icon}
      {children}
    </Link>
  )
}

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r px-4 py-6">
        <nav className="space-y-2">
          <SidebarItem href="/empresa/perfil" icon={<User className="h-4 w-4" />}>
            Perfil
          </SidebarItem>
          <SidebarItem href="/empresa/meus-servicos" icon={<Building2 className="h-4 w-4" />}>
            Serviços
          </SidebarItem>
          <SidebarItem href="/empresa/configuracoes" icon={<Settings className="h-4 w-4" />}>
            Configurações
          </SidebarItem>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
} 