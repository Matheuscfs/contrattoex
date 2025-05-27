-- Criar tabela principal de empresas
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    cnpj TEXT UNIQUE,
    business_type TEXT,
    plan_type TEXT DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro', 'enterprise')),
    email TEXT,
    logo_url TEXT,
    banner_url TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    categories TEXT[] DEFAULT '{}',
    is_open BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de endereços das empresas
CREATE TABLE IF NOT EXISTS public.company_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de contatos das empresas
CREATE TABLE IF NOT EXISTS public.company_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    phone TEXT,
    email TEXT,
    whatsapp TEXT,
    website TEXT,
    social_media JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de horários de funcionamento
CREATE TABLE IF NOT EXISTS public.company_business_hours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    day TEXT NOT NULL CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    open TIME,
    close TIME,
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(company_id, day)
);

-- Criar tabela de serviços das empresas
CREATE TABLE IF NOT EXISTS public.company_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration INTEGER NOT NULL CHECK (duration > 0), -- em minutos
    category TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.company_services(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS companies_user_id_idx ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS companies_status_idx ON public.companies(status);
CREATE INDEX IF NOT EXISTS companies_cnpj_idx ON public.companies(cnpj);
CREATE INDEX IF NOT EXISTS companies_rating_idx ON public.companies(rating);
CREATE INDEX IF NOT EXISTS companies_categories_idx ON public.companies USING GIN(categories);

CREATE INDEX IF NOT EXISTS company_addresses_company_id_idx ON public.company_addresses(company_id);
CREATE INDEX IF NOT EXISTS company_addresses_city_idx ON public.company_addresses(city);
CREATE INDEX IF NOT EXISTS company_addresses_state_idx ON public.company_addresses(state);

CREATE INDEX IF NOT EXISTS company_contacts_company_id_idx ON public.company_contacts(company_id);

CREATE INDEX IF NOT EXISTS company_business_hours_company_id_idx ON public.company_business_hours(company_id);

CREATE INDEX IF NOT EXISTS company_services_company_id_idx ON public.company_services(company_id);
CREATE INDEX IF NOT EXISTS company_services_category_idx ON public.company_services(category);
CREATE INDEX IF NOT EXISTS company_services_active_idx ON public.company_services(is_active);

CREATE INDEX IF NOT EXISTS reviews_company_id_idx ON public.reviews(company_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_status_idx ON public.reviews(status);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews(rating);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_addresses_updated_at
    BEFORE UPDATE ON public.company_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_contacts_updated_at
    BEFORE UPDATE ON public.company_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_business_hours_updated_at
    BEFORE UPDATE ON public.company_business_hours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_services_updated_at
    BEFORE UPDATE ON public.company_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para companies
CREATE POLICY "Empresas podem ver suas próprias informações" ON public.companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver empresas ativas" ON public.companies
    FOR SELECT USING (status = 'active');

CREATE POLICY "Empresas podem atualizar suas próprias informações" ON public.companies
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem criar empresas" ON public.companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para company_addresses
CREATE POLICY "Empresas podem gerenciar seus endereços" ON public.company_addresses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_addresses.company_id 
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem ver endereços de empresas ativas" ON public.company_addresses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_addresses.company_id 
            AND companies.status = 'active'
        )
    );

-- Políticas para company_contacts
CREATE POLICY "Empresas podem gerenciar seus contatos" ON public.company_contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_contacts.company_id 
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem ver contatos de empresas ativas" ON public.company_contacts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_contacts.company_id 
            AND companies.status = 'active'
        )
    );

-- Políticas para company_business_hours
CREATE POLICY "Empresas podem gerenciar seus horários" ON public.company_business_hours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_business_hours.company_id 
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem ver horários de empresas ativas" ON public.company_business_hours
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_business_hours.company_id 
            AND companies.status = 'active'
        )
    );

-- Políticas para company_services
CREATE POLICY "Empresas podem gerenciar seus serviços" ON public.company_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_services.company_id 
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem ver serviços ativos de empresas ativas" ON public.company_services
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_services.company_id 
            AND companies.status = 'active'
        )
    );

-- Políticas para reviews
CREATE POLICY "Usuários podem criar avaliações" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver suas próprias avaliações" ON public.reviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Empresas podem ver avaliações sobre elas" ON public.reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = reviews.company_id 
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem ver avaliações aprovadas" ON public.reviews
    FOR SELECT USING (status = 'approved');

-- Função para atualizar rating da empresa quando uma avaliação é criada/atualizada
CREATE OR REPLACE FUNCTION update_company_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar rating e total de reviews da empresa
    UPDATE public.companies 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM public.reviews 
            WHERE company_id = COALESCE(NEW.company_id, OLD.company_id) 
            AND status = 'approved'
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE company_id = COALESCE(NEW.company_id, OLD.company_id) 
            AND status = 'approved'
        )
    WHERE id = COALESCE(NEW.company_id, OLD.company_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar rating da empresa
CREATE TRIGGER update_company_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_company_rating(); 