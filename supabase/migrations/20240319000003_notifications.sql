-- Tabela de templates de email
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    variables JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver suas próprias notificações" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem marcar suas notificações como lidas" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Função para enviar email (mock - será implementada com Edge Function)
CREATE OR REPLACE FUNCTION notify_user(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_data JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    -- Criar notificação
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (p_user_id, p_type, p_title, p_message, p_data)
    RETURNING id INTO v_notification_id;
    
    -- Aqui será adicionada a chamada para a Edge Function de envio de email
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Templates iniciais
INSERT INTO public.email_templates (name, subject, body, variables) VALUES
('welcome', 
 'Bem-vindo ao Contratto!',
 'Olá {{name}},\n\nSeja bem-vindo ao Contratto! Estamos felizes em ter você conosco.\n\nAtenciosamente,\nEquipe Contratto',
 '{"name": "Nome do usuário"}'
),
('account_approved',
 'Sua conta foi aprovada!',
 'Olá {{name}},\n\nSua conta foi aprovada com sucesso! Agora você já pode começar a utilizar todos os recursos da plataforma.\n\nAtenciosamente,\nEquipe Contratto',
 '{"name": "Nome do usuário"}'
),
('new_service_pending',
 'Novo serviço aguardando aprovação',
 'Olá Admin,\n\nUm novo serviço "{{service_name}}" foi cadastrado por {{user_name}} e está aguardando aprovação.\n\nAtenciosamente,\nEquipe Contratto',
 '{"service_name": "Nome do serviço", "user_name": "Nome do usuário"}'
); 