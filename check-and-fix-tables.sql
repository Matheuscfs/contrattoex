-- Script para verificar e corrigir estrutura das tabelas
-- Execute este script no Supabase SQL Editor

-- Verificar estrutura atual das tabelas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('services', 'quotes') 
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Verificar se as tabelas existem e suas colunas
DO $$
BEGIN
    -- Verificar tabela services
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'services') THEN
        RAISE NOTICE 'Tabela services existe. Verificando estrutura...';
        
        -- Verificar se tem a coluna company_id
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'services' 
            AND column_name = 'company_id'
        ) THEN
            RAISE NOTICE 'Coluna company_id não existe. Recriando tabela...';
            
            -- Fazer backup se houver dados
            CREATE TABLE IF NOT EXISTS services_backup AS SELECT * FROM public.services;
            
            -- Remover tabela atual
            DROP TABLE IF EXISTS public.services CASCADE;
            
            -- Recriar tabela com estrutura correta
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
                
            RAISE NOTICE 'Tabela services recriada com sucesso!';
        ELSE
            RAISE NOTICE 'Tabela services já tem a estrutura correta.';
        END IF;
    ELSE
        RAISE NOTICE 'Tabela services não existe. Criando...';
        
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
            
        RAISE NOTICE 'Tabela services criada com sucesso!';
    END IF;
    
    -- Verificar tabela quotes
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') THEN
        RAISE NOTICE 'Tabela quotes existe. Verificando estrutura...';
        
        -- Verificar se tem a coluna business_id
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'quotes' 
            AND column_name = 'business_id'
        ) THEN
            RAISE NOTICE 'Coluna business_id não existe. Recriando tabela...';
            
            -- Fazer backup se houver dados
            CREATE TABLE IF NOT EXISTS quotes_backup AS SELECT * FROM public.quotes;
            
            -- Remover tabela atual
            DROP TABLE IF EXISTS public.quotes CASCADE;
            
            -- Recriar tabela com estrutura correta
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
                
            RAISE NOTICE 'Tabela quotes recriada com sucesso!';
        ELSE
            RAISE NOTICE 'Tabela quotes já tem a estrutura correta.';
        END IF;
    ELSE
        RAISE NOTICE 'Tabela quotes não existe. Criando...';
        
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
            
        RAISE NOTICE 'Tabela quotes criada com sucesso!';
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

-- Inserir dados de exemplo
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
        
        -- Inserir serviços de exemplo
        INSERT INTO public.services (company_id, name, description, price, duration, category, active)
        VALUES 
            (empresa_id, 'Consultoria em Tecnologia', 'Consultoria especializada em transformação digital e implementação de soluções tecnológicas.', 150.00, 120, 'tecnologia', true),
            (empresa_id, 'Desenvolvimento de Software', 'Desenvolvimento de aplicações web e mobile personalizadas.', 200.00, 180, 'tecnologia', true)
        ON CONFLICT (id) DO NOTHING;
        
        -- Inserir orçamento de exemplo
        INSERT INTO public.quotes (business_id, client_name, client_email, service_name, description, estimated_value, status)
        VALUES 
            (empresa_id, 'João Silva', 'joao@exemplo.com', 'Consultoria em Tecnologia', 'Preciso de uma consultoria para modernizar o sistema da minha empresa.', 1500.00, 'pending')
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Dados de exemplo inseridos com sucesso!';
    ELSE
        RAISE NOTICE 'Empresa de teste não encontrada. Execute primeiro o script de criação de usuários.';
    END IF;
END $$;

-- Verificar estrutura final
SELECT 
    'Estrutura final:' as info,
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('services', 'quotes') 
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Contar registros
SELECT 'services' as tabela, COUNT(*) as registros FROM public.services
UNION ALL
SELECT 'quotes' as tabela, COUNT(*) as registros FROM public.quotes; 