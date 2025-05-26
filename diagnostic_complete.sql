-- Diagnóstico Completo de Problemas de Autenticação
-- Execute este script para identificar TODOS os possíveis problemas

-- 1. Verificar se a extensão uuid-ossp está habilitada
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

-- 2. Verificar configurações do Supabase Auth
SELECT 
    setting_name,
    setting_value
FROM auth.config;

-- 3. Verificar estrutura da tabela auth.users
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 4. Verificar se há triggers na tabela auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement,
    action_condition
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';

-- 5. Verificar se a tabela profiles existe e sua estrutura
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 6. Verificar políticas RLS na tabela profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 7. Verificar se a função handle_new_user existe
SELECT 
    routine_name,
    routine_type,
    security_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- 8. Verificar permissões na tabela profiles
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 9. Verificar se há constraints que podem estar falhando
SELECT 
    constraint_name,
    constraint_type,
    table_name,
    column_name
FROM information_schema.constraint_column_usage 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 10. Verificar logs de erro recentes (se disponível)
-- SELECT * FROM pg_stat_statements WHERE query LIKE '%profiles%' ORDER BY last_exec_time DESC LIMIT 10;

-- 11. Testar se conseguimos inserir diretamente na tabela profiles
-- (Descomente para testar - CUIDADO!)
-- INSERT INTO public.profiles (id, email, name, role) 
-- VALUES ('00000000-0000-0000-0000-000000000001', 'test@test.com', 'Test User', 'customer');

-- 12. Verificar se há outros triggers que podem estar interferindo
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema IN ('public', 'auth')
ORDER BY event_object_table, action_timing;

-- 13. Verificar configurações de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 14. Verificar se há foreign keys que podem estar causando problemas
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'profiles'; 