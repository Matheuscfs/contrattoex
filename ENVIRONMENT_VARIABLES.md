# Variáveis de Ambiente - Deploy Vercel

## Configuração Obrigatória

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Pusher (Real-time)
```
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
PUSHER_APP_ID=your_pusher_app_id
PUSHER_SECRET=your_pusher_secret
```

## Configuração Opcional

### Google Cloud / Vertex AI
```
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account_key.json
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
```

### MercadoPago
```
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token
MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key
```

### Aplicação
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://your-app-domain.vercel.app
```

## Como Configurar no Vercel

1. Acesse o dashboard do Vercel
2. Vá em Settings > Environment Variables
3. Adicione cada variável com seu respectivo valor
4. Marque os ambientes onde cada variável deve estar disponível (Production, Preview, Development) 