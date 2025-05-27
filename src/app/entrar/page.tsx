'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  // Verificar se há erros do callback na URL
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (error) {
      let errorMessage = 'Erro na autenticação';
      
      switch (error) {
        case 'auth_error':
          errorMessage = 'Erro ao processar autenticação';
          break;
        case 'callback_error':
          errorMessage = 'Erro no callback de autenticação';
          break;
        case 'access_denied':
          errorMessage = 'Acesso negado';
          break;
        default:
          errorMessage = `Erro: ${error}`;
      }
      
      if (message) {
        errorMessage += `: ${decodeURIComponent(message)}`;
      }
      
      toast.error(errorMessage);
      
      // Limpar os parâmetros de erro da URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      newUrl.searchParams.delete('message');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      
      // Tenta fazer login
      console.log('Tentando fazer login com:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro detalhado:', {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error
        });

        // Mensagens de erro mais específicas e em português
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('E-mail não confirmado. Por favor, verifique sua caixa de entrada e confirme seu cadastro.');
        } else if (error.message.includes('rate limit')) {
          toast.error('Muitas tentativas de login. Por favor, aguarde alguns minutos antes de tentar novamente.');
        } else if (error.message.includes('Invalid email')) {
          toast.error('E-mail inválido. Por favor, verifique o endereço de e-mail informado.');
        } else if (error.message.includes('Password')) {
          toast.error('Senha inválida. A senha deve ter no mínimo 6 caracteres.');
        } else {
          toast.error(`Erro ao fazer login: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      if (!data?.user) {
        console.error('Login bem sucedido mas sem dados do usuário');
        toast.error('Erro ao recuperar dados do usuário');
        return;
      }

      console.log('Login bem sucedido:', {
        userId: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata
      });

      try {
        // Carrega o perfil completo do usuário
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Erro ao carregar perfil:', profileError);
          toast.error('Erro ao carregar seu perfil. Por favor, tente novamente.');
          return;
        }

        if (!profile) {
          console.error('Perfil não encontrado para o usuário:', data.user.id);
          toast.error('Erro ao carregar seu perfil. Por favor, tente novamente.');
          return;
        }

        console.log('Perfil carregado:', profile);

        const userRole = profile.role || 'customer';
        const roleNames = {
          'customer': 'Cliente',
          'professional': 'Profissional', 
          'company': 'Empresa'
        };
        
        const redirectPath = searchParams.get('from') || 
          `/${userRole === 'company' ? 'empresa' : userRole === 'professional' ? 'profissional' : 'cliente'}/perfil`;
        
        toast.success(`Login realizado com sucesso! Bem-vindo(a), ${profile.name} (${roleNames[userRole as keyof typeof roleNames] || userRole})`);
        
        console.log('Redirecionando para:', redirectPath);
        router.push(redirectPath);
        router.refresh();
      } catch (profileError) {
        console.error('Erro ao processar perfil:', profileError);
        toast.error('Erro ao carregar seu perfil. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro não tratado no login:', error);
      toast.error('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Por favor, digite seu e-mail para recuperar a senha');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) {
        console.error('Erro ao solicitar reset de senha:', error);
        toast.error('Erro ao solicitar reset de senha. Por favor, tente novamente.');
        return;
      }

      toast.success('Instruções de recuperação de senha foram enviadas para seu e-mail.');
    } catch (error) {
      console.error('Erro ao solicitar reset de senha:', error);
      toast.error('Erro ao solicitar reset de senha. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Entre na sua conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite seu e-mail e senha para acessar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <Button
            type="button"
            variant="link"
            className="w-full text-sm text-muted-foreground"
            onClick={handleResetPassword}
            disabled={loading}
          >
            Esqueci minha senha
          </Button>
        </form>

        <div className="text-center text-sm space-y-2">
          <div>
            Não tem uma conta?{' '}
            <Link 
              href="/cadastro/cliente" 
              className="underline underline-offset-4 hover:text-primary"
            >
              Cadastre-se como Cliente
            </Link>
          </div>
          <div>
            <Link 
              href="/cadastro/profissional-empresa" 
              className="underline underline-offset-4 hover:text-primary text-xs"
            >
              Cadastro para Profissionais e Empresas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 