'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Settings,
  Home,
  Package,
  Tag,
  Users,
} from 'lucide-react'

interface SidebarNavProps {
  items?: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

const defaultItems = [
  {
    href: '/dashboard/empresa',
    title: 'Dashboard',
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    href: '/dashboard/empresa/servicos',
    title: 'Serviços',
    icon: <Package className="mr-2 h-4 w-4" />,
  },
  {
    href: '/dashboard/empresa/agenda',
    title: 'Agenda',
    icon: <Calendar className="mr-2 h-4 w-4" />,
  },
  {
    href: '/dashboard/empresa/promocoes',
    title: 'Promoções',
    icon: <Tag className="mr-2 h-4 w-4" />,
  },
  {
    href: '/dashboard/empresa/clientes',
    title: 'Clientes',
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    href: '/dashboard/empresa/configuracoes',
    title: 'Configurações',
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
]

export function SidebarNav({ items = defaultItems }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900',
            pathname === item.href
              ? 'bg-gray-50 text-gray-900'
              : 'text-gray-600'
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 