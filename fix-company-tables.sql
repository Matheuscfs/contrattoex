-- Script simplificado para corrigir tabelas da empresa
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos verificar se as tabelas existem
DO $$
BEGIN
    -- Verificar se a tabela services existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'services') THEN
        -- Criar tabela de serviços
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
        
        -- Índices
        CREATE INDEX idx_services_company_id ON public.services(company_id);
        CREATE INDEX idx_services_category ON public.services(category);
        CREATE INDEX idx_services_active ON public.services(active);
        
        -- RLS
        ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
        
        -- Políticas
        CREATE POLICY "Companies can manage their own services" ON public.services
            FOR ALL USING (auth.uid() = company_id);
            
        CREATE POLICY "Public can view active services" ON public.services
            FOR SELECT USING (active = true);
    END IF;
    
    -- Verificar se a tabela quotes existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') THEN
        -- Criar tabela de orçamentos
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
        
        -- Índices
        CREATE INDEX idx_quotes_business_id ON public.quotes(business_id);
        CREATE INDEX idx_quotes_status ON public.quotes(status);
        
        -- RLS
        ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
        
        -- Políticas
        CREATE POLICY "Companies can manage their own quotes" ON public.quotes
            FOR ALL USING (auth.uid() = business_id);
            
        CREATE POLICY "Anyone can request quotes" ON public.quotes
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Adicionar colunas na tabela profiles se não existirem
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB,
ADD COLUMN IF NOT EXISTS specialties TEXT[];

-- Criar bucket para imagens se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-images', 'company-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para storage (remover existentes primeiro)
DROP POLICY IF EXISTS "Allow authenticated users to upload company images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to company images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own company images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own company images" ON storage.objects;

-- Criar políticas para storage
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

-- Inserir dados de exemplo apenas se não existirem
DO $$
DECLARE
    empresa_id UUID;
BEGIN
    -- Buscar ID da empresa de teste
    SELECT id INTO empresa_id 
    FROM public.profiles 
    WHERE role = 'business' AND email = 'empresa@teste.com'
    LIMIT 1;
    
    -- Se encontrou a empresa, inserir dados de exemplo
    IF empresa_id IS NOT NULL THEN
        -- Inserir serviços de exemplo
        INSERT INTO public.services (company_id, name, description, price, duration, category, active)
        VALUES 
            (empresa_id, 'Consultoria em Tecnologia', 'Consultoria especializada em transformação digital e implementação de soluções tecnológicas.', 150.00, 120, 'tecnologia', true),
            (empresa_id, 'Desenvolvimento de Software', 'Desenvolvimento de aplicações web e mobile personalizadas.', 200.00, 180, 'tecnologia', true)
        ON CONFLICT DO NOTHING;
        
        -- Inserir orçamento de exemplo
        INSERT INTO public.quotes (business_id, client_name, client_email, service_name, description, estimated_value, status)
        VALUES 
            (empresa_id, 'João Silva', 'joao@exemplo.com', 'Consultoria em Tecnologia', 'Preciso de uma consultoria para modernizar o sistema da minha empresa.', 1500.00, 'pending')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Verificar se tudo foi criado corretamente
SELECT 
    'Tabelas criadas:' as info,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'services') THEN 'services ✓' ELSE 'services ✗' END ||
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') THEN ' quotes ✓' ELSE ' quotes ✗' END as status;

-- Contar registros
SELECT 'services' as tabela, COUNT(*) as registros FROM public.services
UNION ALL
SELECT 'quotes' as tabela, COUNT(*) as registros FROM public.quotes; 