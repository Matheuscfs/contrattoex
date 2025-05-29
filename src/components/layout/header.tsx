'use client'

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CompanySettings } from "@/types/company-settings";

export function Header() {
  const { user } = useAuth();
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (user) {
      loadCompanySettings();

      // Inscrever para atualizações na tabela company_settings
      const channel = supabase
        .channel('company_settings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'company_settings',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            loadCompanySettings();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setCompanySettings(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadCompanySettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setCompanySettings(data);
    } catch (error) {
      console.error('Erro ao carregar configurações da empresa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="container mx-auto py-3 px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/contratto-logo.png"
                alt="Contratto"
                width={120}
                height={32}
                priority
                className="mr-2"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/servicos" className="text-sm font-medium hover:text-ifood-red">
                Empresas
              </Link>
              <Link href="/profissionais" className="text-sm font-medium hover:text-ifood-red">
                Profissionais
              </Link>
              <Link href="/empresas" className="text-sm font-medium hover:text-ifood-red">
                Para Empresas
              </Link>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <Button variant="outline" size="sm" className="gap-2 text-sm font-normal border-gray-200 h-10">
                <MapPin size={16} />
                <span>Endereço</span>
              </Button>
            </div>

            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Busque por serviços"
                className="pl-10 h-10 text-sm border-gray-200"
              />
            </div>

            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/cadastro/cliente">
                  <Button>Criar Conta</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
