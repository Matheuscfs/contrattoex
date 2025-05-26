-- Tabela de badges
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT, -- URL do ícone
    criteria JSONB, -- Critérios para ganhar o badge
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de badges dos usuários
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, badge_id)
);

-- Tabela de verificações
CREATE TABLE IF NOT EXISTS public.verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    document_urls TEXT[], -- URLs dos documentos enviados
    notes TEXT,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, type)
);

-- Habilitar RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Badges visíveis para todos" ON public.badges
    FOR SELECT USING (true);

CREATE POLICY "Badges de usuário visíveis para todos" ON public.user_badges
    FOR SELECT USING (true);

CREATE POLICY "Verificações visíveis para o próprio usuário" ON public.verifications
    FOR SELECT USING (auth.uid() = user_id);

-- Inserir badges iniciais
INSERT INTO public.badges (name, description, criteria) VALUES
('Verificado', 'Usuário verificou sua identidade', '{"requires": ["document_verification"]}'),
('Profissional Premium', 'Profissional com alto nível de qualidade', '{"requires": ["min_rating": 4.5, "min_services": 50]}'),
('Empresa Confiável', 'Empresa com documentação validada', '{"requires": ["document_verification", "address_verification"]}');

-- Função para atribuir badge
CREATE OR REPLACE FUNCTION award_badge(
    p_user_id UUID,
    p_badge_name TEXT
) RETURNS UUID AS $$
DECLARE
    v_badge_id UUID;
    v_user_badge_id UUID;
BEGIN
    -- Encontrar o badge
    SELECT id INTO v_badge_id
    FROM public.badges
    WHERE name = p_badge_name;
    
    IF v_badge_id IS NULL THEN
        RAISE EXCEPTION 'Badge não encontrado';
    END IF;
    
    -- Atribuir o badge se ainda não foi atribuído
    INSERT INTO public.user_badges (user_id, badge_id)
    VALUES (p_user_id, v_badge_id)
    ON CONFLICT (user_id, badge_id) DO NOTHING
    RETURNING id INTO v_user_badge_id;
    
    -- Notificar usuário
    IF v_user_badge_id IS NOT NULL THEN
        PERFORM notify_user(
            p_user_id,
            'badge_awarded',
            'Novo badge conquistado!',
            format('Parabéns! Você conquistou o badge "%s"', p_badge_name)
        );
    END IF;
    
    RETURN v_user_badge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 