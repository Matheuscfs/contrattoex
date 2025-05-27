-- Script para recriar usuários de teste com confirmação automática
-- Execute este script no Supabase SQL Editor

-- 1. Limpar usuários existentes (se houver)
DELETE FROM auth.users WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com');
DELETE FROM public.profiles WHERE email IN ('empresa@teste.com', 'cliente@teste.com', 'profissional@teste.com');

-- 2. Criar usuários diretamente na tabela auth.users com confirmação automática
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES 
-- Usuário Cliente
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'cliente@teste.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Cliente Teste"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
-- Usuário Profissional
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'profissional@teste.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Profissional Teste"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
-- Usuário Empresa
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'empresa@teste.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Empresa Teste"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 3. Criar perfis correspondentes na tabela public.profiles
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
    id,
    email,
    CASE 
        WHEN email = 'cliente@teste.com' THEN 'Cliente Teste'
        WHEN email = 'profissional@teste.com' THEN 'Profissional Teste'
        WHEN email = 'empresa@teste.com' THEN 'Empresa Teste'
    END as full_name,
    CASE 
        WHEN email = 'cliente@teste.com' THEN 'customer'
        WHEN email = 'profissional@teste.com' THEN 'professional'
        WHEN email = 'empresa@teste.com' THEN 'business'
    END as role,
    NOW(),
    NOW()
FROM auth.users 
WHERE email IN ('cliente@teste.com', 'profissional@teste.com', 'empresa@teste.com');

-- 4. Verificar se os usuários foram criados corretamente
SELECT 
    'Usuários criados:' as info,
    u.email,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    p.role,
    p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('cliente@teste.com', 'profissional@teste.com', 'empresa@teste.com')
ORDER BY u.email;

-- 5. Inserir dados de exemplo para a empresa
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
        RAISE NOTICE 'Empresa de teste não encontrada após criação.';
    END IF;
END $$;

-- 6. Verificação final
SELECT 
    'Verificação final:' as info,
    'Usuários criados e confirmados' as status;

SELECT 
    'Contagem final:' as info,
    (SELECT COUNT(*) FROM auth.users WHERE email IN ('cliente@teste.com', 'profissional@teste.com', 'empresa@teste.com')) as usuarios_auth,
    (SELECT COUNT(*) FROM public.profiles WHERE email IN ('cliente@teste.com', 'profissional@teste.com', 'empresa@teste.com')) as perfis,
    (SELECT COUNT(*) FROM public.services) as servicos,
    (SELECT COUNT(*) FROM public.quotes) as orcamentos; 