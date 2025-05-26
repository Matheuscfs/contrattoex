'use client'

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Settings,
  Users,
  Package,
  Percent,
  CreditCard,
  Menu,
  X,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/empresa",
    icon: <Home className="w-6 h-6" />,
  },
  {
    title: "Serviços",
    href: "/empresa/meus-servicos",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    title: "Agenda",
    href: "/empresa/agenda",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    title: "Clientes",
    href: "/empresa/clientes",
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: "Pagamentos",
    href: "/empresa/pagamentos",
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    title: "Configurações",
    href: "/empresa/configuracoes",
    icon: <Settings className="w-6 h-6" />,
  },
];

interface CompanyLayoutProps {
  children: React.ReactNode;
}

function NavLink({ href, icon, title, isActive }: NavItem & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
      )}
    >
      {icon}
      {title}
    </Link>
  );
}

export function CompanyLayout({ children }: CompanyLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 flex-col fixed left-0">
        <div className="flex h-14 items-center border-b px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            Contratto
          </Link>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden fixed left-4 top-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-4 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contratto
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="h-14 border-b" />
        {children}
      </main>
    </div>
  );
} 