-- Script de diagnóstico para identificar problemas de autenticação
-- Execute este script primeiro para ver o estado atual do banco

-- 1. Verificar se a tabela profiles existe e sua estrutura
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Verificar políticas RLS ativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Verificar triggers ativos na tabela auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';

-- 4. Verificar se a função handle_new_user existe
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- 5. Verificar permissões na tabela profiles
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 6. Tentar criar um usuário de teste (comentado por segurança)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (gen_random_uuid(), 'test@example.com', 'encrypted', NOW(), NOW(), NOW()); 