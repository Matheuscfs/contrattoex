-- Script completo para atualizar tabelas do banco de dados
-- Execute este script no Supabase SQL Editor

-- 1. Verificar e corrigir tabela services
DO $$
BEGIN
    -- Verificar se a tabela services existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public') THEN
        -- Verificar se tem a coluna company_id
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'services' 
            AND column_name = 'company_id'
            AND table_schema = 'public'
        ) THEN
            RAISE NOTICE 'Recriando tabela services com estrutura correta...';
            
            -- Fazer backup se houver dados
            CREATE TABLE IF NOT EXISTS services_backup AS SELECT * FROM public.services;
            
            -- Remover tabela atual
            DROP TABLE IF EXISTS public.services CASCADE;
        ELSE
            RAISE NOTICE 'Tabela services já tem estrutura correta.';
        END IF;
    END IF;
    
    -- Criar ou recriar tabela services
    CREATE TABLE IF NOT EXISTS public.services (
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
    
    -- Índices para performance
    CREATE INDEX IF NOT EXISTS idx_services_company_id ON public.services(company_id);
    CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
    CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);
    
    -- Habilitar RLS
    ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
    
    -- Remover políticas existentes
    DROP POLICY IF EXISTS "Companies can manage their own services" ON public.services;
    DROP POLICY IF EXISTS "Public can view active services" ON public.services;
    
    -- Criar políticas
    CREATE POLICY "Companies can manage their own services" ON public.services
        FOR ALL USING (auth.uid() = company_id);
        
    CREATE POLICY "Public can view active services" ON public.services
        FOR SELECT USING (active = true);
        
    RAISE NOTICE 'Tabela services configurada com sucesso!';
END $$;

-- 2. Verificar e corrigir tabela quotes
DO $$
BEGIN
    -- Verificar se a tabela quotes existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes' AND table_schema = 'public') THEN
        -- Verificar se tem a coluna business_id
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'quotes' 
            AND column_name = 'business_id'
            AND table_schema = 'public'
        ) THEN
            RAISE NOTICE 'Recriando tabela quotes com estrutura correta...';
            
            -- Fazer backup se houver dados
            CREATE TABLE IF NOT EXISTS quotes_backup AS SELECT * FROM public.quotes;
            
            -- Remover tabela atual
            DROP TABLE IF EXISTS public.quotes CASCADE;
        ELSE
            RAISE NOTICE 'Tabela quotes já tem estrutura correta.';
        END IF;
    END IF;
    
    -- Criar ou recriar tabela quotes
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
    
    -- Índices para performance
    CREATE INDEX IF NOT EXISTS idx_quotes_business_id ON public.quotes(business_id);
    CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
    CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at);
    
    -- Habilitar RLS
    ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
    
    -- Remover políticas existentes
    DROP POLICY IF EXISTS "Companies can manage their own quotes" ON public.quotes;
    DROP POLICY IF EXISTS "Anyone can request quotes" ON public.quotes;
    
    -- Criar políticas
    CREATE POLICY "Companies can manage their own quotes" ON public.quotes
        FOR ALL USING (auth.uid() = business_id);
        
    CREATE POLICY "Anyone can request quotes" ON public.quotes
        FOR INSERT WITH CHECK (true);
        
    RAISE NOTICE 'Tabela quotes configurada com sucesso!';
END $$;

-- 3. Atualizar tabela profiles com novos campos
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB,
ADD COLUMN IF NOT EXISTS specialties TEXT[];

-- 4. Configurar storage para imagens da empresa
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-images', 'company-images', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes do storage
DROP POLICY IF EXISTS "Company images upload" ON storage.objects;
DROP POLICY IF EXISTS "Company images view" ON storage.objects;
DROP POLICY IF EXISTS "Company images update" ON storage.objects;
DROP POLICY IF EXISTS "Company images delete" ON storage.objects;

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

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
DROP TRIGGER IF EXISTS update_quotes_updated_at ON public.quotes;

CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON public.services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON public.quotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Inserir dados de exemplo para teste
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
        RAISE NOTICE 'Inserindo dados de exemplo para empresa: %', empresa_id;
        
        -- Limpar dados existentes para evitar duplicatas
        DELETE FROM public.services WHERE company_id = empresa_id;
        DELETE FROM public.quotes WHERE business_id = empresa_id;
        
        -- Inserir serviços de exemplo
        INSERT INTO public.services (company_id, name, description, price, duration, category, active)
        VALUES 
            (empresa_id, 'Consultoria em Tecnologia', 'Consultoria especializada em transformação digital e implementação de soluções tecnológicas para empresas de todos os portes.', 150.00, 120, 'tecnologia', true),
            (empresa_id, 'Desenvolvimento de Software', 'Desenvolvimento de aplicações web e mobile personalizadas utilizando as mais modernas tecnologias do mercado.', 200.00, 180, 'tecnologia', true),
            (empresa_id, 'Auditoria de Sistemas', 'Análise completa de segurança e performance dos sistemas existentes com relatório detalhado.', 300.00, 240, 'consultoria', true);
        
        -- Inserir orçamentos de exemplo
        INSERT INTO public.quotes (business_id, client_name, client_email, client_phone, service_name, description, estimated_value, status)
        VALUES 
            (empresa_id, 'João Silva', 'joao@exemplo.com', '(11) 99999-9999', 'Consultoria em Tecnologia', 'Preciso de uma consultoria para modernizar o sistema da minha empresa e implementar novas tecnologias.', 1500.00, 'pending'),
            (empresa_id, 'Maria Santos', 'maria@exemplo.com', '(11) 88888-8888', 'Desenvolvimento de Software', 'Gostaria de desenvolver um aplicativo mobile para meu negócio.', 5000.00, 'approved'),
            (empresa_id, 'Pedro Costa', 'pedro@exemplo.com', '(11) 77777-7777', 'Auditoria de Sistemas', 'Necessito de uma auditoria completa dos sistemas da empresa.', 2500.00, 'pending');
        
        RAISE NOTICE 'Dados de exemplo inseridos com sucesso!';
    ELSE
        RAISE NOTICE 'Empresa de teste não encontrada. Certifique-se de que o usuário empresa@teste.com existe.';
    END IF;
END $$;

-- 8. Verificar se tudo foi criado corretamente
SELECT 
    'Verificação final - Tabelas:' as info,
    table_name,
    CASE 
        WHEN table_name = 'services' THEN (SELECT COUNT(*)::text FROM public.services)
        WHEN table_name = 'quotes' THEN (SELECT COUNT(*)::text FROM public.quotes)
        ELSE 'N/A'
    END as registros
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('services', 'quotes', 'profiles')
ORDER BY table_name;

-- 9. Verificar estrutura das colunas
SELECT 
    'Estrutura services:' as info,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
    'Estrutura quotes:' as info,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'quotes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Verificar bucket de storage
SELECT 
    'Storage bucket:' as info,
    id,
    name,
    public
FROM storage.buckets 
WHERE id = 'company-images';

RAISE NOTICE 'Script executado com sucesso! Todas as tabelas foram atualizadas e configuradas.'; 