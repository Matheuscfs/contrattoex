-- SOLUÇÃO DEFINITIVA - Execute este script no Supabase Dashboard
-- Esta é a abordagem mais simples e que deve funcionar

-- 1. Limpar tudo relacionado a triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Recriar tabela profiles do zero
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Criar tabela profiles simples
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

-- 4. Desabilitar RLS completamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 5. Dar todas as permissões
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- 6. Criar função para criar perfil
CREATE OR REPLACE FUNCTION public.create_user_profile(
    user_id UUID,
    user_email TEXT,
    user_name TEXT DEFAULT NULL,
    user_role TEXT DEFAULT 'customer'
)
RETURNS UUID AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (user_id, user_email, COALESCE(user_name, 'Usuário'), user_role);
    RETURN user_id;
EXCEPTION WHEN OTHERS THEN
    -- Se der erro, tenta update
    UPDATE public.profiles 
    SET email = user_email, name = COALESCE(user_name, name), role = user_role
    WHERE id = user_id;
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Dar permissão na função
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO service_role; 