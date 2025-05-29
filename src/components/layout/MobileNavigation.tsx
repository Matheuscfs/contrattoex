'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Building2, 
  Users, 
  Briefcase, 
  User,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Início',
    href: '/',
    icon: Home,
  },
  {
    name: 'Empresas',
    href: '/servicos',
    icon: Briefcase,
  },
  {
    name: 'Profissionais',
    href: '/profissionais',
    icon: Users,
  },
  {
    name: 'Sobre',
    href: '/empresas',
    icon: Building2,
  },
  {
    name: 'Perfil',
    href: '/perfil',
    icon: User,
  },
];

export default function MobileNavigation() {
  const pathname = usePathname();

  // Não mostrar o menu em certas páginas específicas
  const hideNavigation = ['/login', '/auth', '/criar-conta'].some(path => 
    pathname.startsWith(path)
  );

  if (hideNavigation) {
    return null;
  }

  return (
    <>
      {/* Backdrop para iOS safe area */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white md:hidden pointer-events-none" 
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      
      {/* Menu de navegação */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
        <div className="px-1 py-1" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <nav className="flex items-center justify-around">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative flex flex-col items-center justify-center py-1.5 px-1 min-w-0 flex-1 text-xs transition-all duration-200 rounded-lg active:scale-95',
                    isActive
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-gray-700 active:bg-gray-100'
                  )}
                >
                  {/* Indicador de página ativa */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-red-600 rounded-full" />
                  )}
                  
                  <div className={cn(
                    'p-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-red-50'
                      : 'hover:bg-gray-50'
                  )}>
                    <item.icon
                      className={cn(
                        'w-4 h-4 transition-all duration-200',
                        isActive
                          ? 'text-red-600'
                          : 'text-gray-500'
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  
                  <span
                    className={cn(
                      'text-xs font-medium truncate transition-all duration-200 mt-0.5',
                      isActive
                        ? 'text-red-600 font-semibold'
                        : 'text-gray-500'
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Espaço para evitar sobreposição do conteúdo */}
      <div className="h-16 md:hidden" />
    </>
  );
} 