-- Script para verificar status dos usuários de teste
-- Execute este script no Supabase SQL Editor

-- 1. Verificar usuários na tabela auth.users
SELECT 
    'Usuários auth.users:' as info,
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com')
ORDER BY email;

-- 2. Verificar perfis na tabela public.profiles
SELECT 
    'Perfis public.profiles:' as info,
    id,
    email,
    role,
    full_name,
    created_at
FROM public.profiles 
WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com')
ORDER BY email;

-- 3. Verificar se emails estão confirmados
SELECT 
    'Status de confirmação:' as info,
    email,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Confirmado'
        ELSE 'Não confirmado'
    END as status_confirmacao,
    email_confirmed_at
FROM auth.users 
WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com')
ORDER BY email;

-- 4. Contar total de usuários
SELECT 
    'Total de usuários:' as info,
    COUNT(*) as total_auth_users
FROM auth.users;

SELECT 
    'Total de perfis:' as info,
    COUNT(*) as total_profiles
FROM public.profiles; 