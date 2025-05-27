-- SCRIPT DE DIAGNÓSTICO E CORREÇÃO COMPLETA DO BANCO DE DADOS
-- Execute este script no Supabase SQL Editor

-- 1. VERIFICAR ESTADO ATUAL DO BANCO
SELECT 'DIAGNÓSTICO INICIAL' as status;

-- Verificar se as extensões necessárias estão habilitadas
SELECT 
    'Extensões instaladas:' as info,
    extname as extensao
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- Verificar tabelas existentes
SELECT 
    'Tabelas existentes:' as info,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar usuários na tabela auth
SELECT 
    'Usuários auth:' as info,
    COUNT(*) as total_usuarios
FROM auth.users;

-- 2. LIMPAR E RECRIAR TUDO DO ZERO
SELECT 'INICIANDO LIMPEZA E RECRIAÇÃO' as status;

-- Remover tabelas existentes
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;

-- Remover políticas de storage existentes
DROP POLICY IF EXISTS "Company images upload" ON storage.objects;
DROP POLICY IF EXISTS "Company images view" ON storage.objects;
DROP POLICY IF EXISTS "Company images update" ON storage.objects;
DROP POLICY IF EXISTS "Company images delete" ON storage.objects;

-- Remover bucket se existir
DELETE FROM storage.buckets WHERE id = 'company-images';

-- Limpar usuários de teste existentes
DELETE FROM auth.users WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com');
DELETE FROM public.profiles WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com');

-- 3. GARANTIR QUE EXTENSÕES ESTÃO INSTALADAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 4. CORRIGIR TABELA PROFILES
-- Adicionar colunas necessárias se não existirem
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB,
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- 5. CRIAR TABELA SERVICES
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 60,
    category TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para services
CREATE INDEX idx_services_company_id ON public.services(company_id);
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_active ON public.services(active);

-- RLS para services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies can manage their own services" ON public.services
    FOR ALL USING (auth.uid() = company_id);
CREATE POLICY "Public can view active services" ON public.services
    FOR SELECT USING (active = true);

-- 6. CRIAR TABELA QUOTES
CREATE TABLE public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    service_name TEXT NOT NULL,
    description TEXT NOT NULL,
    estimated_value DECIMAL(10,2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para quotes
CREATE INDEX idx_quotes_business_id ON public.quotes(business_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);

-- RLS para quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies can manage their own quotes" ON public.quotes
    FOR ALL USING (auth.uid() = business_id);
CREATE POLICY "Anyone can request quotes" ON public.quotes
    FOR INSERT WITH CHECK (true);

-- 7. CONFIGURAR STORAGE
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-images', 'company-images', true);

-- Políticas simples para storage
CREATE POLICY "Company images upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-images');

CREATE POLICY "Company images view" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'company-images');

CREATE POLICY "Company images update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'company-images');

CREATE POLICY "Company images delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'company-images');

-- 8. CRIAR USUÁRIO EMPRESA DE TESTE
DO $$
DECLARE
    empresa_user_id UUID := gen_random_uuid();
BEGIN
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
        empresa_user_id,
        'authenticated',
        'authenticated',
        'empresa@teste.com',
        crypt('123456', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"role": "company"}'
    );
    
    -- Criar perfil na tabela profiles
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        name,
        role, 
        description,
        phone,
        address,
        city,
        state,
        status,
        verified,
        created_at, 
        updated_at
    ) VALUES (
        empresa_user_id,
        'empresa@teste.com',
        'Empresa Teste',
        'Empresa Teste',
        'company',
        'Empresa de teste para demonstração do sistema',
        '(11) 99999-9999',
        'Rua das Empresas, 123',
        'São Paulo',
        'SP',
        'approved',
        true,
        NOW(),
        NOW()
    );
    
    -- Inserir serviços de exemplo
    INSERT INTO public.services (company_id, name, description, price, duration, category, active)
    VALUES 
        (empresa_user_id, 'Consultoria em Tecnologia', 'Consultoria especializada em transformação digital e implementação de soluções tecnológicas.', 150.00, 120, 'tecnologia', true),
        (empresa_user_id, 'Desenvolvimento de Software', 'Desenvolvimento de aplicações web e mobile personalizadas.', 200.00, 180, 'tecnologia', true),
        (empresa_user_id, 'Auditoria de Sistemas', 'Análise completa de segurança e performance dos sistemas existentes.', 300.00, 240, 'consultoria', true);
    
    -- Inserir orçamentos de exemplo
    INSERT INTO public.quotes (business_id, client_name, client_email, client_phone, service_name, description, estimated_value, status)
    VALUES 
        (empresa_user_id, 'João Silva', 'joao@exemplo.com', '(11) 99999-9999', 'Consultoria em Tecnologia', 'Preciso de uma consultoria para modernizar o sistema da minha empresa.', 1500.00, 'pending'),
        (empresa_user_id, 'Maria Santos', 'maria@exemplo.com', '(11) 88888-8888', 'Desenvolvimento de Software', 'Gostaria de desenvolver um aplicativo mobile para meu negócio.', 5000.00, 'approved'),
        (empresa_user_id, 'Pedro Costa', 'pedro@exemplo.com', '(11) 77777-7777', 'Auditoria de Sistemas', 'Necessito de uma auditoria completa dos sistemas da empresa.', 2500.00, 'pending');
    
    RAISE NOTICE 'Usuário empresa criado com ID: %', empresa_user_id;
END $$;

-- 9. VERIFICAÇÃO FINAL COMPLETA
SELECT 'VERIFICAÇÃO FINAL' as status;

-- Verificar usuário criado
SELECT 
    'Usuário empresa criado:' as info,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    p.full_name,
    p.role
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'empresa@teste.com';

-- Verificar tabelas criadas
SELECT 
    'Tabelas criadas:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'services', 'quotes')
ORDER BY table_name;

-- Verificar dados inseridos
SELECT 
    'Dados inseridos:' as info,
    (SELECT COUNT(*) FROM public.services) as servicos,
    (SELECT COUNT(*) FROM public.quotes) as orcamentos,
    (SELECT COUNT(*) FROM auth.users WHERE email = 'empresa@teste.com') as usuario_auth,
    (SELECT COUNT(*) FROM public.profiles WHERE email = 'empresa@teste.com') as perfil;

-- Verificar storage
SELECT 
    'Storage configurado:' as info,
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'company-images';

-- Verificar políticas RLS
SELECT 
    'Políticas RLS:' as info,
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('services', 'quotes')
ORDER BY tablename, policyname;

-- 10. CREDENCIAIS FINAIS
SELECT 
    'CREDENCIAIS DE TESTE' as info,
    'empresa@teste.com' as email,
    '123456' as senha,
    'company' as role;

SELECT 'SETUP COMPLETO - BANCO RECRIADO COM SUCESSO!' as resultado; 