-- Adicionar campo featured para destacar profissionais
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Criar índice para busca otimizada de profissionais em destaque
CREATE INDEX IF NOT EXISTS idx_profiles_featured ON public.profiles(featured, featured_order) WHERE featured = true;

-- Criar tabela para gerenciar destaques
CREATE TABLE IF NOT EXISTS public.featured_professionals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT, -- Título personalizado para o destaque
    description TEXT, -- Descrição personalizada
    highlight_text TEXT, -- Texto de destaque (ex: "Profissional do Mês")
    badge_color TEXT DEFAULT 'primary', -- Cor do badge
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(profile_id)
);

-- Habilitar RLS
ALTER TABLE public.featured_professionals ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Featured professionals visible to all" ON public.featured_professionals
    FOR SELECT USING (active = true AND (ends_at IS NULL OR ends_at > NOW()));

CREATE POLICY "Only admins can manage featured professionals" ON public.featured_professionals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Função para atualizar automaticamente o campo featured na tabela profiles
CREATE OR REPLACE FUNCTION update_profile_featured()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.profiles 
        SET 
            featured = NEW.active,
            featured_at = CASE WHEN NEW.active THEN NOW() ELSE NULL END,
            featured_order = NEW.display_order
        WHERE id = NEW.profile_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.profiles 
        SET 
            featured = false,
            featured_at = NULL,
            featured_order = 0
        WHERE id = OLD.profile_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para sincronizar featured status
CREATE TRIGGER sync_featured_status
    AFTER INSERT OR UPDATE OR DELETE ON public.featured_professionals
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_featured();

-- Inserir alguns profissionais em destaque como exemplo
INSERT INTO public.featured_professionals (profile_id, title, description, highlight_text, badge_color, display_order, active)
SELECT 
    p.id,
    'Profissional Verificado',
    'Especialista com excelente avaliação dos clientes',
    'Destaque',
    'success',
    ROW_NUMBER() OVER (ORDER BY p.created_at),
    true
FROM public.profiles p
WHERE p.role = 'professional' 
AND p.status = 'approved'
AND p.verified = true
LIMIT 6
ON CONFLICT (profile_id) DO NOTHING; 