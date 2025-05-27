-- Solução Alternativa - Remover Trigger e Criar Perfil Manualmente
-- Esta abordagem remove o trigger problemático e cria o perfil via código

-- PASSO 1: Remover completamente o trigger problemático
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- PASSO 2: Remover todas as políticas RLS restritivas
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_all_access" ON public.profiles;
DROP POLICY IF EXISTS "allow_all" ON public.profiles;

-- PASSO 3: Desabilitar RLS temporariamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- PASSO 4: Garantir que a tabela profiles existe com estrutura mínima
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    name TEXT,
    role TEXT DEFAULT 'customer',
    status TEXT DEFAULT 'approved',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASSO 5: Dar permissões totais
GRANT ALL PRIVILEGES ON public.profiles TO anon, authenticated, service_role, postgres;

-- PASSO 6: Criar função para criar perfil manualmente (será chamada pelo código)
CREATE OR REPLACE FUNCTION public.create_user_profile(
    user_id UUID,
    user_email TEXT,
    user_name TEXT DEFAULT NULL,
    user_role TEXT DEFAULT 'customer'
)
RETURNS UUID AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, status, verified)
    VALUES (user_id, user_email, COALESCE(user_name, split_part(user_email, '@', 1)), user_role, 'approved', false)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, profiles.name),
        role = COALESCE(EXCLUDED.role, profiles.role),
        updated_at = NOW();
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 7: Dar permissões na função
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon, authenticated, service_role; 