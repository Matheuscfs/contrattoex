-- Script para corrigir estrutura da tabela profiles
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estrutura atual da tabela profiles
SELECT 
    'Estrutura atual da tabela profiles:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Adicionar colunas que podem estar faltando
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB,
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- 3. Atualizar registros existentes que podem ter full_name vazio
UPDATE public.profiles 
SET 
    full_name = CASE 
        WHEN role = 'business' THEN 'Empresa Teste'
        WHEN role = 'professional' THEN 'Profissional Teste'
        WHEN role = 'customer' THEN 'Cliente Teste'
        ELSE email
    END,
    updated_at = NOW()
WHERE full_name IS NULL OR full_name = '';

-- 4. Verificar estrutura final
SELECT 
    'Estrutura final da tabela profiles:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Verificar dados existentes
SELECT 
    'Dados existentes na tabela profiles:' as info,
    id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles 
WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com')
ORDER BY email;

-- 6. Se não existirem usuários, criar um usuário empresa básico
DO $$
BEGIN
    -- Verificar se existe usuário empresa
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'empresa@teste.com'
    ) THEN
        RAISE NOTICE 'Criando usuário empresa...';
        
        -- Criar usuário na tabela auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'empresa@teste.com',
            crypt('123456', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{}'
        );
        
        -- Criar perfil correspondente
        INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
        SELECT 
            id,
            'empresa@teste.com',
            'Empresa Teste',
            'business',
            NOW(),
            NOW()
        FROM auth.users 
        WHERE email = 'empresa@teste.com';
        
        RAISE NOTICE 'Usuário empresa criado com sucesso!';
    ELSE
        -- Se usuário existe mas não tem perfil, criar perfil
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles WHERE email = 'empresa@teste.com'
        ) THEN
            INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
            SELECT 
                id,
                'empresa@teste.com',
                'Empresa Teste',
                'business',
                NOW(),
                NOW()
            FROM auth.users 
            WHERE email = 'empresa@teste.com';
            
            RAISE NOTICE 'Perfil criado para usuário existente!';
        ELSE
            RAISE NOTICE 'Usuário e perfil já existem!';
        END IF;
    END IF;
END $$;

-- 7. Confirmar email do usuário
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'empresa@teste.com'
AND email_confirmed_at IS NULL;

-- 8. Verificação final completa
SELECT 
    'Verificação final - Usuário empresa:' as resultado,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'empresa@teste.com';

RAISE NOTICE 'Script executado com sucesso! Tabela profiles corrigida e usuário empresa configurado.'; 