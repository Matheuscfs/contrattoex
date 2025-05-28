-- Script para atualizar logos das empresas existentes
-- Execute no Supabase SQL Editor

-- Verificar empresas existentes
SELECT 
    id, 
    name, 
    full_name, 
    email, 
    avatar_url,
    role,
    created_at
FROM public.profiles 
WHERE role IN ('business', 'company')
ORDER BY created_at;

-- Atualizar as primeiras 5 empresas com as logos fornecidas
WITH company_updates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY created_at) as rn
    FROM public.profiles 
    WHERE role IN ('business', 'company')
    LIMIT 5
)
UPDATE public.profiles 
SET 
    full_name = CASE 
        WHEN cu.rn = 1 THEN 'Grupo UNUS'
        WHEN cu.rn = 2 THEN 'Transdesk'
        WHEN cu.rn = 3 THEN 'BR Center Truck'
        WHEN cu.rn = 4 THEN 'TDK Corretora de Seguros'
        WHEN cu.rn = 5 THEN 'TK Soluções'
    END,
    name = CASE 
        WHEN cu.rn = 1 THEN 'Grupo UNUS'
        WHEN cu.rn = 2 THEN 'Transdesk'
        WHEN cu.rn = 3 THEN 'BR Center Truck'
        WHEN cu.rn = 4 THEN 'TDK Corretora de Seguros'
        WHEN cu.rn = 5 THEN 'TK Soluções'
    END,
    avatar_url = CASE 
        WHEN cu.rn = 1 THEN '/logos/grupo-unus.png'
        WHEN cu.rn = 2 THEN '/logos/transdesk.png'
        WHEN cu.rn = 3 THEN '/logos/br-center-truck.png'
        WHEN cu.rn = 4 THEN '/logos/tdk-seguros.png'
        WHEN cu.rn = 5 THEN '/logos/tk.png'
    END,
    description = CASE 
        WHEN cu.rn = 1 THEN 'Grupo empresarial especializado em soluções corporativas e serviços integrados'
        WHEN cu.rn = 2 THEN 'Soluções em logística e transporte com tecnologia avançada'
        WHEN cu.rn = 3 THEN 'Centro automotivo especializado em caminhões e veículos pesados'
        WHEN cu.rn = 4 THEN 'Corretora de seguros com soluções personalizadas'
        WHEN cu.rn = 5 THEN 'Empresa de soluções tecnológicas e consultoria'
    END,
    website = CASE 
        WHEN cu.rn = 1 THEN 'https://grupounus.com.br'
        WHEN cu.rn = 2 THEN 'https://transdesk.com.br'
        WHEN cu.rn = 3 THEN 'https://brcentertruck.com.br'
        WHEN cu.rn = 4 THEN 'https://tdkseguros.com.br'
        WHEN cu.rn = 5 THEN 'https://tksolucoes.com.br'
    END,
    updated_at = NOW()
FROM company_updates cu
WHERE public.profiles.id = cu.id;

-- Verificar resultado
SELECT 
    id, 
    name, 
    full_name, 
    email, 
    avatar_url,
    description,
    website,
    role
FROM public.profiles 
WHERE role IN ('business', 'company')
ORDER BY created_at; 