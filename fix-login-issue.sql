-- Script simples para corrigir problema de login
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, execute o script de atualização das tabelas
-- (se ainda não executou o update-database-tables.sql)

-- 2. Confirmar emails dos usuários existentes
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com')
AND email_confirmed_at IS NULL;

-- 3. Verificar se os usuários existem e estão confirmados
SELECT 
    'Status dos usuários:' as info,
    email,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Confirmado ✓'
        ELSE 'Não confirmado ✗'
    END as status,
    created_at
FROM auth.users 
WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com')
ORDER BY email;

-- 4. Verificar perfis correspondentes
SELECT 
    'Perfis dos usuários:' as info,
    email,
    role,
    full_name
FROM public.profiles 
WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com')
ORDER BY email;

-- 5. Se não existirem usuários, criar novos
DO $$
BEGIN
    -- Verificar se existe pelo menos um usuário
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com')
    ) THEN
        RAISE NOTICE 'Usuários não encontrados. Criando novos usuários...';
        
        -- Criar usuário empresa
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
        
        -- Criar perfil empresa
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
        RAISE NOTICE 'Usuários já existem. Apenas confirmando emails...';
    END IF;
END $$;

-- 6. Verificação final
SELECT 
    'Verificação final:' as resultado,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'empresa@teste.com';

-- 7. Testar se as tabelas estão funcionando
SELECT 
    'Tabelas disponíveis:' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services') 
        THEN 'services ✓' 
        ELSE 'services ✗' 
    END ||
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quotes') 
        THEN ' quotes ✓' 
        ELSE ' quotes ✗' 
    END as status_tabelas; 