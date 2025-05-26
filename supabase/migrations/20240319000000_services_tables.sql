-- Tabela de Serviços
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration INTEGER, -- em minutos
    category TEXT NOT NULL,
    subcategory TEXT,
    images TEXT[], -- array de URLs
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_approval')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança para Serviços
CREATE POLICY "Serviços visíveis para todos" ON public.services
    FOR SELECT USING (status = 'active');

CREATE POLICY "Usuários podem criar seus próprios serviços" ON public.services
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios serviços" ON public.services
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios serviços" ON public.services
    FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT, -- URL do ícone
    parent_id UUID REFERENCES public.service_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Política de leitura para categorias
CREATE POLICY "Categorias visíveis para todos" ON public.service_categories
    FOR SELECT USING (true);

-- Inserir categorias principais
INSERT INTO public.service_categories (name, description) VALUES
    ('Serviços Gerais & Manutenção', 'Serviços de manutenção e reparos em geral'),
    ('Instalações & Técnicos', 'Serviços técnicos e instalações'),
    ('Beleza, Moda & Bem-estar', 'Serviços de beleza e cuidados pessoais'),
    ('Saúde & Terapias', 'Serviços relacionados à saúde e terapias'),
    ('Educação & Aulas', 'Serviços educacionais e aulas particulares'),
    ('Design & Tecnologia', 'Serviços de design e tecnologia'),
    ('Serviços Automotivos', 'Serviços para veículos'),
    ('Eventos & Produção', 'Serviços para eventos e produções'),
    ('Serviços para Pets', 'Serviços para animais de estimação')
ON CONFLICT (name) DO NOTHING; 