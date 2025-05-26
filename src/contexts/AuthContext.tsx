'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { toast } from 'sonner'
import { Profile, ProfileUpdateInput } from '@/types/profile'

interface User {
  id: string
  email?: string
  user_metadata: {
    name?: string
    role?: 'customer' | 'professional' | 'company' | 'admin'
    avatar_url?: string
    [key: string]: any
  }
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: ProfileUpdateInput) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const refreshProfile = async (userId?: string) => {
    try {
      const id = userId || user?.id
      if (!id) {
        console.warn('Tentativa de carregar perfil sem ID do usuário')
        return
      }

      // Busca o perfil usando o ID ao invés do email
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Erro ao buscar perfil:', fetchError)
        return
      }

      // Se o perfil não existe, cria um novo
      if (!existingProfile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id,
            email: user?.email,
            name: user?.user_metadata?.name
          }])
          .select()
          .single()

        if (insertError) {
          console.error('Erro ao criar perfil:', insertError)
          return
        }

        setProfile(newProfile)
        return
      }

      setProfile(existingProfile)
    } catch (error) {
      console.error('Erro ao carregar/criar perfil:', error)
      toast.error('Erro ao carregar dados do perfil')
    }
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.id) {
        setUser(session.user)
        await refreshProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user?.id) {
        await refreshProfile(data.user.id)
      }

      toast.success('Login realizado com sucesso!')
      router.refresh()
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro ao fazer login. Verifique suas credenciais.')
      throw error
    }
  }

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      // Tenta criar o usuário com dados mínimos primeiro
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: metadata.name,
            role: metadata.user_type || 'customer'
          }
        }
      });

      if (signUpError) {
        console.error('Erro no cadastro:', signUpError);
        if (signUpError.message.includes('already registered')) {
          toast.error('Este e-mail já está cadastrado');
        } else if (signUpError.message.includes('valid email')) {
          toast.error('E-mail inválido');
        } else {
          toast.error('Erro ao criar conta. Tente novamente.');
        }
        throw signUpError;
      }

      if (!data.user) {
        console.error('Usuário não criado');
        toast.error('Erro ao criar conta. Tente novamente.');
        return;
      }

      // Se o usuário foi criado com sucesso, tenta criar o perfil
      try {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            email: email,
            name: metadata.name,
            role: metadata.user_type || 'customer'
          }])
          .single();

        if (insertError) {
          console.error('Erro ao criar perfil:', insertError);
          // Não vamos mostrar esse erro para o usuário ainda, pois o usuário foi criado
        }
      } catch (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Não vamos mostrar esse erro para o usuário ainda, pois o usuário foi criado
      }

      toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.');
      router.refresh();
    } catch (error) {
      console.error('Erro no cadastro:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
      throw error;
    }
  }

  const signOut = async () => {
    try {
      console.log('Iniciando processo de logout...')
      
      // Primeiro, limpar o estado local
      setUser(null)
      setProfile(null)
      
      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erro no signOut do Supabase:', error)
        throw error
      }
      
      console.log('Logout do Supabase concluído')
      
      // Limpar localStorage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        
        // Limpar cookies do Supabase
        const cookies = document.cookie.split(';')
        cookies.forEach(cookie => {
          const eqPos = cookie.indexOf('=')
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          if (name.includes('supabase') || name.includes('sb-')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          }
        })
      }
      
      console.log('Limpeza de dados concluída')
      
      toast.success('Logout realizado com sucesso!')
      
      // Redirecionar para a página inicial
      router.push('/')
      
      // Forçar refresh da página para garantir limpeza completa
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
      
    } catch (error) {
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
      
      // Mesmo com erro, limpar estado local e redirecionar
      setUser(null)
      setProfile(null)
      
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
      
      throw error
    }
  }

  const updateProfile = async (data: ProfileUpdateInput) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile(user.id)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 