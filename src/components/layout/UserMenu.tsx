'use client'

import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationButton } from '@/components/notifications/NotificationButton'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/types/profile'

export function UserMenu() {
  const { user, profile, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  if (!user) return null

  const userInitials = (profile?.name || user.user_metadata?.name)
    ? (profile?.name || user.user_metadata?.name || '')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U'

  const userRole = (profile?.role || user.user_metadata?.role || 'customer') as UserRole

  const getDashboardLink = () => {
    switch (userRole) {
      case 'business':
        return '/empresa/perfil'
      case 'professional':
        return '/profissional/perfil'
      default:
        return '/cliente/perfil'
    }
  }

  const getSettingsLink = () => {
    switch (userRole) {
      case 'business':
        return '/empresa/configuracoes'
      case 'professional':
        return '/profissional/configuracoes'
      default:
        return '/cliente/configuracoes'
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      console.log('Iniciando logout...')
      
      await signOut()
      
      console.log('Logout concluído, redirecionando...')
      
      // Forçar redirecionamento e limpeza
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      toast.error('Erro ao fazer logout. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <NotificationButton />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage 
                src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                alt={profile?.name || user.user_metadata?.name} 
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.name || user.user_metadata?.name || 'Usuário'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <Link href={getDashboardLink()} className="cursor-pointer">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Minha Área
            </DropdownMenuItem>
          </Link>
          
          <Link href={getSettingsLink()} className="cursor-pointer">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
          </Link>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 cursor-pointer"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Saindo...' : 'Sair'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 