# Contratto

Plataforma de marketplace que conecta profissionais, empresas e clientes para prestação de serviços.

## Funcionalidades

### Gestão de Serviços
- Cadastro e gerenciamento de serviços
- Categorização de serviços
- Precificação e duração
- Ativação/inativação de serviços

### Agenda
- Calendário de agendamentos
- Visualização por dia/semana/mês
- Horários disponíveis por serviço
- Confirmação e cancelamento de agendamentos
- Histórico de atendimentos
- Resumo diário de agendamentos
- Métricas de ocupação e faturamento

## 🚀 Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- shadcn/ui
- Lucide Icons
- React Hook Form
- Zod
- Prisma
- Pusher
- Jest
- React Testing Library
- ESLint
- Prettier

## Estrutura do Banco de Dados

### Tabela: servicos
- id: uuid (PK)
- empresa_id: uuid (FK)
- nome: text
- descricao: text
- preco: numeric(10,2)
- duracao: integer
- categoria: text
- status: enum ('ativo', 'inativo')
- created_at: timestamp
- updated_at: timestamp

### Tabela: agendamentos
- id: uuid (PK)
- empresa_id: uuid (FK)
- cliente_id: uuid (FK)
- servico_id: uuid (FK)
- data_hora: timestamp
- duracao: integer
- preco: numeric(10,2)
- status: enum ('pendente', 'confirmado', 'concluido', 'cancelado')
- observacoes: text
- created_at: timestamp
- updated_at: timestamp

## 📦 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/contratto.git
cd contratto
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

5. Configure o Supabase
```bash
supabase init
supabase start
```

6. Execute as migrações
```bash
supabase db reset
```

## Desenvolvimento

### Estrutura de Diretórios

```
src/
  ├── app/                    # Rotas e páginas
  │   └── dashboard/
  │       └── empresa/
  │           ├── servicos/   # Módulo de serviços
  │           └── agenda/     # Módulo de agenda
  ├── components/            # Componentes reutilizáveis
  ├── contexts/             # Contextos React
  ├── hooks/               # Hooks personalizados
  ├── lib/                # Funções utilitárias
  └── types/             # Definições de tipos
```

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm run test

# Lint
npm run lint

# Migrations
npm run db:migrate
npm run db:seed
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
