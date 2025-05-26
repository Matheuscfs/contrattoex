-- Script para corrigir problemas de autenticação no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Limpar triggers e funções existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Limpar todas as políticas existentes na tabela profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias informações" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias informações" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- 3. Garantir que a tabela profiles existe com todas as colunas necessárias
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'professional', 'business', 'admin')),
    document TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    avatar_url TEXT,
    bio TEXT,
    specialties TEXT[],
    business_hours JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS simplificadas e funcionais
CREATE POLICY "profiles_select_all" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- 6. Criar função para lidar com novos usuários (mais robusta)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    user_role TEXT;
    user_name TEXT;
    user_status TEXT;
BEGIN
    -- Extrair dados do metadata
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'name', 
        NEW.raw_user_meta_data->>'full_name', 
        split_part(NEW.email, '@', 1)
    );
    
    -- Definir status baseado no role
    user_status := CASE 
        WHEN user_role = 'customer' THEN 'approved'
        ELSE 'pending'
    END;
    
    -- Tentar inserir o perfil
    BEGIN
        INSERT INTO public.profiles (
            id, 
            email, 
            name, 
            role,
            status,
            verified
        )
        VALUES (
            NEW.id,
            NEW.email,
            user_name,
            user_role,
            user_status,
            false
        );
        
        RAISE LOG 'Profile created successfully for user % with role %', NEW.id, user_role;
        
    EXCEPTION WHEN unique_violation THEN
        -- Se o perfil já existe, atualizar
        UPDATE public.profiles 
        SET 
            email = NEW.email,
            name = COALESCE(user_name, name),
            role = COALESCE(user_role, role),
            updated_at = NOW()
        WHERE id = NEW.id;
        
        RAISE LOG 'Profile updated for existing user %', NEW.id;
        
    EXCEPTION WHEN OTHERS THEN
        -- Log do erro mas não falhar a criação do usuário
        RAISE LOG 'Error creating profile for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
        -- Não re-raise o erro para não bloquear a criação do usuário
    END;
    
    RETURN NEW;
END;
$$;

-- 7. Criar o trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 8. Garantir permissões adequadas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated;

-- 9. Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Verificar configuração (execute as consultas abaixo separadamente se necessário)
-- Políticas ativas:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'profiles';

-- Triggers ativos:
-- SELECT trigger_name, event_manipulation, action_statement FROM information_schema.triggers WHERE event_object_table = 'users' AND trigger_schema = 'auth'; 