-- Script para confirmar emails dos usuários de teste
-- Execute este script no Supabase SQL Editor

-- Confirmar emails dos usuários de teste
UPDATE auth.users 
SET 
  email_confirmed_at = NOW()
WHERE email IN (
  'cliente@teste.com',
  'profissional@teste.com', 
  'empresa@teste.com'
) AND email_confirmed_at IS NULL;

-- Verificar se os usuários foram confirmados
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email IN (
  'cliente@teste.com',
  'profissional@teste.com', 
  'empresa@teste.com'
)
ORDER BY email; 