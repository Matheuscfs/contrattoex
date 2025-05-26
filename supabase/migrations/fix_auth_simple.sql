-- Script simplificado para corrigir problemas de autenticação
-- Execute este script no SQL Editor do Supabase Dashboard

-- Limpar configurações existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Limpar políticas conflitantes
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
    DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
    DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignorar erros se as políticas não existirem
END $$;

-- Garantir que a tabela profiles existe
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

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas simples
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Função robusta para criar perfis
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
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
            COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
            CASE 
                WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'customer' THEN 'approved'
                ELSE 'pending'
            END,
            false
        );
    EXCEPTION WHEN OTHERS THEN
        -- Não falhar a criação do usuário mesmo se houver erro no perfil
        NULL;
    END;
    
    RETURN NEW;
END;
$$;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Garantir permissões
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated; 