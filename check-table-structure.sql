-- Script para verificar estrutura atual das tabelas
-- Execute este script no Supabase SQL Editor para diagnosticar o problema

-- 1. Verificar se as tabelas existem
SELECT 
    'Tabelas existentes:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('services', 'quotes', 'profiles')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela services (se existir)
SELECT 
    'Estrutura da tabela services:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela quotes (se existir)
SELECT 
    'Estrutura da tabela quotes:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quotes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar estrutura da tabela profiles
SELECT 
    'Estrutura da tabela profiles:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Verificar usuário empresa de teste
SELECT 
    'Usuário empresa de teste:' as info,
    id,
    email,
    role,
    full_name
FROM public.profiles 
WHERE email = 'empresa@teste.com';

-- 6. Verificar buckets de storage
SELECT 
    'Buckets de storage:' as info,
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'company-images';

-- 7. Contar registros nas tabelas (se existirem)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'services') THEN
        PERFORM 1; -- Tabela existe, podemos contar
    END IF;
END $$;

-- Verificar se podemos contar registros
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'services') 
        THEN (SELECT COUNT(*)::text FROM public.services)
        ELSE 'Tabela não existe'
    END as services_count,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') 
        THEN (SELECT COUNT(*)::text FROM public.quotes)
        ELSE 'Tabela não existe'
    END as quotes_count; 