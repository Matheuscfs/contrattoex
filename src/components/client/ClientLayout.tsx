"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Agendamentos",
    href: "/cliente/agendamentos",
    icon: Calendar,
  },
  {
    name: "Favoritos",
    href: "/cliente/favoritos",
    icon: Heart,
  },
  {
    name: "Avaliações",
    href: "/cliente/avaliacoes",
    icon: Star,
  },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-200"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 