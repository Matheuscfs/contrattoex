# Supabase

Este diretório contém as configurações e migrações do Supabase para o projeto iServiços.

## Estrutura

- `migrations/`: Contém os arquivos de migração do banco de dados
- `config.toml`: Arquivo de configuração do Supabase
- `seed.sql`: Arquivo com dados iniciais para o banco de dados

## Migrações

### Criar uma nova migração

```bash
supabase migration new nome_da_migracao
```

### Aplicar migrações

```bash
supabase db reset
```

### Reverter migrações

```bash
supabase db reset --db-only
```

## Desenvolvimento Local

1. Instalar o Supabase CLI
2. Iniciar o Supabase localmente:
   ```bash
   supabase start
   ```
3. Parar o Supabase:
   ```bash
   supabase stop
   ```

## Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha as variáveis:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Políticas de Segurança

As políticas de segurança (RLS) são definidas nas migrações e garantem que:

- Empresas só podem ver seus próprios serviços
- Empresas só podem criar serviços para si mesmas
- Empresas só podem atualizar seus próprios serviços
- Empresas só podem excluir seus próprios serviços 