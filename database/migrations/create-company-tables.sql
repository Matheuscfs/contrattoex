-- Script para criar tabelas necessárias para o perfil da empresa
-- Execute este script no Supabase SQL Editor

-- Criar bucket para imagens da empresa se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-images', 'company-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de imagens
CREATE POLICY "Allow authenticated users to upload company images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-images');

-- Política para permitir visualização pública das imagens
CREATE POLICY "Allow public access to company images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'company-images');

-- Política para permitir atualização das próprias imagens
CREATE POLICY "Allow users to update their own company images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'company-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir exclusão das próprias imagens
CREATE POLICY "Allow users to delete their own company images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'company-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 60, -- em minutos
    category TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para a tabela de serviços
CREATE INDEX IF NOT EXISTS idx_services_company_id ON public.services(company_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);

-- RLS para serviços
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Políticas para serviços
CREATE POLICY "Companies can view their own services" ON public.services
    FOR SELECT USING (auth.uid() = company_id);

CREATE POLICY "Companies can insert their own services" ON public.services
    FOR INSERT WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Companies can update their own services" ON public.services
    FOR UPDATE USING (auth.uid() = company_id);

CREATE POLICY "Companies can delete their own services" ON public.services
    FOR DELETE USING (auth.uid() = company_id);

-- Política para permitir visualização pública dos serviços ativos
CREATE POLICY "Public can view active services" ON public.services
    FOR SELECT USING (active = true);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS public.quotes (
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

-- Índices para a tabela de orçamentos
CREATE INDEX IF NOT EXISTS idx_quotes_business_id ON public.quotes(business_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at);

-- RLS para orçamentos
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Políticas para orçamentos
CREATE POLICY "Companies can view their own quotes" ON public.quotes
    FOR SELECT USING (auth.uid() = business_id);

CREATE POLICY "Companies can update their own quotes" ON public.quotes
    FOR UPDATE USING (auth.uid() = business_id);

-- Política para permitir inserção pública de orçamentos (para clientes)
CREATE POLICY "Anyone can request quotes" ON public.quotes
    FOR INSERT WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON public.services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON public.quotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Atualizar tabela profiles para incluir novos campos
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB,
ADD COLUMN IF NOT EXISTS specialties TEXT[];

-- Dados de exemplo para teste
INSERT INTO public.services (company_id, name, description, price, duration, category, active)
SELECT 
    id,
    'Consultoria em Tecnologia',
    'Consultoria especializada em transformação digital e implementação de soluções tecnológicas.',
    150.00,
    120,
    'tecnologia',
    true
FROM public.profiles 
WHERE role = 'business' AND email = 'empresa@teste.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (company_id, name, description, price, duration, category, active)
SELECT 
    id,
    'Desenvolvimento de Software',
    'Desenvolvimento de aplicações web e mobile personalizadas.',
    200.00,
    180,
    'tecnologia',
    true
FROM public.profiles 
WHERE role = 'business' AND email = 'empresa@teste.com'
ON CONFLICT (id) DO NOTHING;

-- Orçamento de exemplo
INSERT INTO public.quotes (business_id, client_name, client_email, service_name, description, estimated_value, status)
SELECT 
    id,
    'João Silva',
    'joao@exemplo.com',
    'Consultoria em Tecnologia',
    'Preciso de uma consultoria para modernizar o sistema da minha empresa.',
    1500.00,
    'pending'
FROM public.profiles 
WHERE role = 'business' AND email = 'empresa@teste.com'
ON CONFLICT DO NOTHING;

-- Verificar se as tabelas foram criadas
SELECT 
    'services' as table_name,
    COUNT(*) as record_count
FROM public.services
UNION ALL
SELECT 
    'quotes' as table_name,
    COUNT(*) as record_count
FROM public.quotes;

-- Verificar permissões
SELECT schemaname, tablename, hasinsert, hasselect, hasupdate, hasdelete 
FROM pg_tables 
LEFT JOIN information_schema.table_privileges ON table_name = tablename 
WHERE schemaname = 'public' 
AND tablename IN ('services', 'quotes'); 