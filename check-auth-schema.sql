-- SCRIPT PARA VERIFICAR E CORRIGIR PROBLEMAS DO ESQUEMA AUTH
-- Execute este script no Supabase SQL Editor

-- 1. VERIFICAR ESQUEMA AUTH
SELECT 'VERIFICANDO ESQUEMA AUTH' as status;

-- Verificar se o esquema auth existe
SELECT 
    'Esquema auth existe:' as info,
    EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') as existe;

-- Verificar tabelas do esquema auth
SELECT 
    'Tabelas do esquema auth:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- Verificar se a tabela auth.users tem as colunas necessárias
SELECT 
    'Colunas da tabela auth.users:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. VERIFICAR EXTENSÕES NECESSÁRIAS
SELECT 'VERIFICANDO EXTENSÕES' as status;

-- Verificar extensões instaladas
SELECT 
    'Extensões instaladas:' as info,
    extname,
    extversion
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pgjwt');

-- Instalar extensões se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. VERIFICAR FUNÇÕES AUTH
SELECT 'VERIFICANDO FUNÇÕES AUTH' as status;

-- Verificar se a função auth.uid() existe
SELECT 
    'Função auth.uid() existe:' as info,
    EXISTS(
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'auth' 
        AND routine_name = 'uid'
    ) as existe;

-- Verificar se a função auth.role() existe
SELECT 
    'Função auth.role() existe:' as info,
    EXISTS(
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'auth' 
        AND routine_name = 'role'
    ) as existe;

-- 4. VERIFICAR POLÍTICAS RLS
SELECT 'VERIFICANDO POLÍTICAS RLS' as status;

-- Verificar se RLS está habilitado nas tabelas
SELECT 
    'RLS habilitado:' as info,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'services', 'quotes');

-- 5. TESTE DE CONECTIVIDADE
SELECT 'TESTANDO CONECTIVIDADE' as status;

-- Testar se conseguimos acessar auth.users
SELECT 
    'Acesso a auth.users:' as info,
    COUNT(*) as total_usuarios
FROM auth.users;

-- Testar se conseguimos acessar public.profiles
SELECT 
    'Acesso a public.profiles:' as info,
    COUNT(*) as total_perfis
FROM public.profiles;

-- 6. VERIFICAR CONFIGURAÇÕES DE AUTENTICAÇÃO
SELECT 'VERIFICANDO CONFIGURAÇÕES AUTH' as status;

-- Verificar configurações do auth
SELECT 
    'Configurações auth:' as info,
    name,
    setting
FROM pg_settings 
WHERE name LIKE '%auth%' OR name LIKE '%jwt%'
ORDER BY name;

-- 7. CRIAR FUNÇÃO DE TESTE SIMPLES
CREATE OR REPLACE FUNCTION test_auth_connection()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Testar acesso básico
    PERFORM COUNT(*) FROM auth.users;
    PERFORM COUNT(*) FROM public.profiles;
    
    RETURN 'Conexão com esquemas auth e public funcionando corretamente';
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Erro ao acessar esquemas: ' || SQLERRM;
END;
$$;

-- Executar teste
SELECT test_auth_connection() as resultado_teste;

-- 8. VERIFICAR PERMISSÕES
SELECT 'VERIFICANDO PERMISSÕES' as status;

-- Verificar permissões do usuário atual
SELECT 
    'Usuário atual:' as info,
    current_user as usuario,
    session_user as sessao;

-- Verificar se temos permissões nas tabelas auth
SELECT 
    'Permissões em auth.users:' as info,
    has_table_privilege('auth.users', 'SELECT') as select_perm,
    has_table_privilege('auth.users', 'INSERT') as insert_perm,
    has_table_privilege('auth.users', 'UPDATE') as update_perm;

-- 9. LIMPAR FUNÇÃO DE TESTE
DROP FUNCTION IF EXISTS test_auth_connection();

SELECT 'VERIFICAÇÃO DO ESQUEMA AUTH CONCLUÍDA' as status; 