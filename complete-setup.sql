-- Script completo para configurar tudo de uma vez
-- Execute este script no Supabase SQL Editor

-- PARTE 1: CORRIGIR TABELA PROFILES
-- Adicionar todas as colunas necessárias
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

-- PARTE 2: CRIAR/CORRIGIR TABELA SERVICES
DROP TABLE IF EXISTS public.services CASCADE;
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

-- PARTE 3: CRIAR/CORRIGIR TABELA QUOTES
DROP TABLE IF EXISTS public.quotes CASCADE;
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

-- PARTE 4: CONFIGURAR STORAGE
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-images', 'company-images', true)
ON CONFLICT (id) DO NOTHING;

-- PARTE 5: CRIAR USUÁRIO EMPRESA DE TESTE
DO $$
DECLARE
    empresa_user_id UUID;
BEGIN
    -- Limpar usuário existente se houver
    DELETE FROM auth.users WHERE email = 'empresa@teste.com';
    DELETE FROM public.profiles WHERE email = 'empresa@teste.com';
    
    -- Criar novo usuário
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
    ) RETURNING id INTO empresa_user_id;
    
    -- Criar perfil
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
        empresa_user_id,
        'empresa@teste.com',
        'Empresa Teste',
        'business',
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

-- PARTE 6: VERIFICAÇÃO FINAL
SELECT 
    'VERIFICAÇÃO FINAL:' as status,
    'Usuário empresa:' as tipo,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    p.full_name,
    p.role
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'empresa@teste.com';

SELECT 
    'CONTAGEM DE DADOS:' as status,
    (SELECT COUNT(*) FROM public.services) as servicos,
    (SELECT COUNT(*) FROM public.quotes) as orcamentos,
    (SELECT COUNT(*) FROM auth.users WHERE email = 'empresa@teste.com') as usuario_auth,
    (SELECT COUNT(*) FROM public.profiles WHERE email = 'empresa@teste.com') as perfil;

-- PARTE 7: MOSTRAR CREDENCIAIS
SELECT 
    'CREDENCIAIS DE TESTE:' as info,
    'Email: empresa@teste.com' as email,
    'Senha: 123456' as senha,
    'Role: business' as role;

-- Mensagem final
DO $$
BEGIN
    RAISE NOTICE 'SETUP COMPLETO! Use: empresa@teste.com / 123456';
END $$; 