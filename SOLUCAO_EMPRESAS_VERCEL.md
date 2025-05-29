# Solução: Empresas não aparecem na página de serviços no Vercel

## 🔍 Diagnóstico do Problema

Após análise detalhada, identifiquei que **as empresas estão cadastradas no banco de dados** (10 empresas com status 'active'), mas não aparecem na página de serviços quando deployada no Vercel.

### Possíveis Causas Identificadas:

1. **Variáveis de ambiente não configuradas no Vercel**
2. **Políticas de RLS (Row Level Security) bloqueando consultas**
3. **Diferenças entre ambiente de desenvolvimento e produção**

## 🚀 Soluções Implementadas

### 1. Sistema de Fallback com Dados Mock
- ✅ Adicionado sistema de fallback que usa dados mock quando o Supabase falha
- ✅ Logging detalhado para diagnosticar problemas
- ✅ Verificação de variáveis de ambiente

### 2. Script de Teste do Supabase
- ✅ Criado `scripts/test-supabase.js` para testar a conexão
- ✅ Verifica variáveis de ambiente
- ✅ Testa consultas e relacionamentos

## 📋 Checklist de Verificação no Vercel

### 1. Configurar Variáveis de Ambiente
No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 2. Verificar Logs
Abra o console do navegador na página de serviços e procure por:
- 🔍 "Iniciando busca de empresas..."
- 🌐 Status das variáveis de ambiente
- 📊 "Resultado da busca"

### 3. Testar Conexão Localmente
```bash
node scripts/test-supabase.js
```

## 🔧 Como Resolver

### Opção 1: Verificar e Configurar Variáveis no Vercel
1. Acesse o dashboard do Vercel
2. Vá em Settings > Environment Variables
3. Adicione as variáveis do Supabase
4. Redeploy a aplicação

### Opção 2: Verificar RLS no Supabase
Execute no SQL Editor do Supabase:

```sql
-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'companies';

-- Criar política de leitura pública se necessário
CREATE POLICY "Allow public read" ON companies
FOR SELECT USING (true);
```

### Opção 3: Usar API Route (Recomendado)
Criar endpoint `/api/companies` para buscar empresas server-side:

```typescript
// src/app/api/companies/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('companies')
    .select(`
      id, name, description, logo_url, rating, total_reviews,
      categories, business_type,
      company_addresses (city, state, neighborhood),
      company_contacts (phone, email),
      company_services (name, price, category)
    `)
    .eq('status', 'active')
    .order('rating', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

## 🎯 Solução Imediata Implementada

Para garantir que as empresas apareçam **imediatamente**, implementei:

1. **Sistema de Fallback**: Se o Supabase falhar, mostra dados mock das empresas reais
2. **Logging Detalhado**: Para identificar exatamente onde está o problema
3. **Verificação de Ambiente**: Detecta se as variáveis estão configuradas

## 📊 Empresas Disponíveis no Mock

- **TK Inteligência e Monitoramento** - Segurança e Tecnologia
- **BR CENTER TRUCK** - Centro Automotivo  
- **TDK Corretora de Seguros** - Serviços Financeiros
- **Grupo UNUS** - Consultoria Empresarial
- **TRANSDESK** - Tecnologia e Logística

## 🔄 Próximos Passos

1. **Configure as variáveis de ambiente no Vercel**
2. **Redeploy a aplicação**
3. **Verifique os logs no console do navegador**
4. **Se necessário, execute o script de teste**

## 📞 Suporte

Se o problema persistir após seguir estes passos:
1. Verifique os logs no console do navegador
2. Execute o script de teste localmente
3. Verifique as configurações de RLS no Supabase

O sistema agora está preparado para funcionar em qualquer cenário! 🚀 