-- Tabela de denúncias
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL, -- 'service', 'profile', 'review', etc.
    content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de ações de moderação
CREATE TABLE IF NOT EXISTS public.moderation_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL, -- 'warning', 'suspension', 'ban', etc.
    reason TEXT NOT NULL,
    description TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de histórico de moderação
CREATE TABLE IF NOT EXISTS public.moderation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL,
    content_id UUID NOT NULL,
    action TEXT NOT NULL,
    reason TEXT,
    moderator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem criar denúncias" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Usuários podem ver suas próprias denúncias" ON public.reports
    FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Moderadores podem ver todas as denúncias" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Função para criar denúncia
CREATE OR REPLACE FUNCTION report_content(
    p_content_type TEXT,
    p_content_id UUID,
    p_reason TEXT,
    p_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_report_id UUID;
    v_reported_user_id UUID;
BEGIN
    -- Encontrar o usuário denunciado baseado no tipo de conteúdo
    CASE p_content_type
        WHEN 'service' THEN
            SELECT user_id INTO v_reported_user_id
            FROM public.services
            WHERE id = p_content_id;
        WHEN 'profile' THEN
            v_reported_user_id := p_content_id;
        -- Adicionar outros casos conforme necessário
    END CASE;
    
    IF v_reported_user_id IS NULL THEN
        RAISE EXCEPTION 'Conteúdo não encontrado';
    END IF;
    
    -- Criar a denúncia
    INSERT INTO public.reports (
        reporter_id,
        reported_user_id,
        content_type,
        content_id,
        reason,
        description
    )
    VALUES (
        auth.uid(),
        v_reported_user_id,
        p_content_type,
        p_content_id,
        p_reason,
        p_description
    )
    RETURNING id INTO v_report_id;
    
    -- Notificar moderadores (implementar depois via Edge Function)
    
    RETURN v_report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para resolver denúncia
CREATE OR REPLACE FUNCTION resolve_report(
    p_report_id UUID,
    p_status TEXT,
    p_action_type TEXT DEFAULT NULL,
    p_action_reason TEXT DEFAULT NULL,
    p_action_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_report RECORD;
    v_action_id UUID;
BEGIN
    -- Verificar se é moderador
    IF NOT EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    ) THEN
        RAISE EXCEPTION 'Permissão negada';
    END IF;
    
    -- Buscar denúncia
    SELECT * INTO v_report
    FROM public.reports
    WHERE id = p_report_id;
    
    IF v_report IS NULL THEN
        RAISE EXCEPTION 'Denúncia não encontrada';
    END IF;
    
    -- Atualizar status da denúncia
    UPDATE public.reports
    SET status = p_status,
        resolved_by = auth.uid(),
        resolved_at = NOW()
    WHERE id = p_report_id;
    
    -- Se houver ação de moderação, criar
    IF p_action_type IS NOT NULL THEN
        INSERT INTO public.moderation_actions (
            user_id,
            moderator_id,
            action_type,
            reason,
            expires_at
        )
        VALUES (
            v_report.reported_user_id,
            auth.uid(),
            p_action_type,
            p_action_reason,
            p_action_expires_at
        )
        RETURNING id INTO v_action_id;
        
        -- Registrar no histórico
        INSERT INTO public.moderation_history (
            content_type,
            content_id,
            action,
            reason,
            moderator_id
        )
        VALUES (
            v_report.content_type,
            v_report.content_id,
            p_action_type,
            p_action_reason,
            auth.uid()
        );
        
        -- Notificar usuário sobre a ação (implementar depois via Edge Function)
    END IF;
    
    RETURN v_action_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 