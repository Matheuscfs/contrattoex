# Configuração do Claude via Google Cloud Vertex AI

Este guia explica como configurar e usar o Claude AI através do Google Cloud Vertex AI no seu projeto Next.js.

## 📋 Pré-requisitos

1. **Conta Google Cloud** com billing ativado
2. **Projeto Google Cloud** criado
3. **APIs habilitadas**:
   - Vertex AI API
   - AI Platform API

## 🚀 Configuração Inicial

### 1. Configurar Google Cloud

#### 1.1 Criar um Projeto
```bash
# Via CLI (opcional)
gcloud projects create seu-projeto-id
gcloud config set project seu-projeto-id
```

#### 1.2 Habilitar APIs
```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable ml.googleapis.com
```

#### 1.3 Criar Service Account
```bash
# Criar service account
gcloud iam service-accounts create claude-vertex-ai \
    --description="Service account para Claude via Vertex AI" \
    --display-name="Claude Vertex AI"

# Dar permissões necessárias
gcloud projects add-iam-policy-binding seu-projeto-id \
    --member="serviceAccount:claude-vertex-ai@seu-projeto-id.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Criar e baixar chave
gcloud iam service-accounts keys create ./claude-vertex-ai-key.json \
    --iam-account=claude-vertex-ai@seu-projeto-id.iam.gserviceaccount.com
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Google Cloud Vertex AI - Claude Integration
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./claude-vertex-ai-key.json

# Outras variáveis existentes...
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# ... etc
```

### 3. Instalar Dependências

As dependências já foram instaladas:
```bash
npm install @google-cloud/aiplatform @google-cloud/vertexai google-auth-library
```

## 🎯 Como Usar

### 1. Usando o Hook `useClaude`

```tsx
import { useClaude } from '@/hooks/use-claude';

function MeuComponente() {
  const claude = useClaude();

  const handleAskQuestion = async () => {
    const response = await claude.askQuestion('Olá, como você está?');
    console.log(response);
  };

  return (
    <div>
      <button onClick={handleAskQuestion} disabled={claude.loading}>
        {claude.loading ? 'Carregando...' : 'Perguntar ao Claude'}
      </button>
      {claude.error && <p>Erro: {claude.error}</p>}
    </div>
  );
}
```

### 2. Usando o Hook `useClaudeChat`

```tsx
import { useClaudeChat } from '@/hooks/use-claude';

function ChatComponent() {
  const chat = useClaudeChat();

  const handleSend = async () => {
    await chat.sendMessage('Qual é a capital do Brasil?');
  };

  return (
    <div>
      {chat.messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
```

### 3. Usando a API Diretamente

```tsx
// POST /api/claude
const response = await fetch('/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'chat',
    messages: [
      { role: 'user', content: 'Olá!' }
    ],
    model: 'claude-3-sonnet@20240229'
  })
});

const data = await response.json();
console.log(data.data.content);
```

## 🔧 Funcionalidades Disponíveis

### 1. Chat Conversacional
- Conversa natural com Claude
- Histórico de mensagens
- Diferentes modelos (Opus 4, Sonnet 4, Haiku)

### 2. Análise de Texto
- **Sentimento**: Análise positivo/negativo/neutro
- **Resumo**: Resumos concisos de textos longos
- **Palavras-chave**: Extração de termos importantes
- **Classificação**: Categorização de conteúdo

### 3. Geração de Código
- Suporte a múltiplas linguagens
- Código limpo e documentado
- Explicações detalhadas

### 4. Streaming (em desenvolvimento)
- Respostas em tempo real
- Melhor experiência do usuário

## 📊 Modelos Disponíveis

| Modelo | Descrição | Uso Recomendado |
|--------|-----------|-----------------|
| **Claude Opus 4** | Mais poderoso | Tarefas complexas, código avançado |
| **Claude Sonnet 4** | Balanceado | Uso geral, boa relação custo/benefício |
| **Claude Haiku** | Rápido | Tarefas simples, respostas rápidas |

## 💰 Custos

Os custos são baseados no uso de tokens:

- **Claude Opus 4**: ~$15 por 1M tokens de entrada, ~$75 por 1M tokens de saída
- **Claude Sonnet 4**: ~$3 por 1M tokens de entrada, ~$15 por 1M tokens de saída
- **Claude Haiku**: Mais econômico para tarefas simples

## 🔒 Segurança

### Boas Práticas:
1. **Nunca** commite o arquivo de chave JSON
2. Use variáveis de ambiente para credenciais
3. Implemente rate limiting em produção
4. Monitore o uso de tokens

### Arquivo `.gitignore`:
```
# Google Cloud credentials
*-key.json
.env.local
.env
```

## 🧪 Testando a Integração

### 1. Health Check
```bash
curl http://localhost:3000/api/claude?action=health
```

### 2. Listar Modelos
```bash
curl http://localhost:3000/api/claude?action=models
```

### 3. Teste Simples
```bash
curl -X POST http://localhost:3000/api/claude \
  -H "Content-Type: application/json" \
  -d '{
    "action": "chat",
    "messages": [{"role": "user", "content": "Olá!"}]
  }'
```

## 🎨 Componente de Exemplo

Já foi criado um componente completo em `src/components/claude/ClaudeChat.tsx` que demonstra todas as funcionalidades.

Para usar:
```tsx
import { ClaudeChat } from '@/components/claude/ClaudeChat';

export default function TestePage() {
  return (
    <div>
      <h1>Teste do Claude AI</h1>
      <ClaudeChat />
    </div>
  );
}
```

## 🐛 Troubleshooting

### Erro: "GOOGLE_CLOUD_PROJECT_ID não configurado"
- Verifique se a variável está no `.env.local`
- Reinicie o servidor de desenvolvimento

### Erro: "Authentication failed"
- Verifique o caminho do arquivo de credenciais
- Confirme as permissões do service account

### Erro: "API not enabled"
- Habilite a Vertex AI API no Google Cloud Console
- Aguarde alguns minutos para propagação

### Erro: "Quota exceeded"
- Verifique os limites da sua conta Google Cloud
- Considere aumentar as cotas se necessário

## 📚 Recursos Adicionais

- [Documentação Vertex AI](https://cloud.google.com/vertex-ai/docs)
- [Documentação Claude](https://docs.anthropic.com/)
- [Preços Vertex AI](https://cloud.google.com/vertex-ai/pricing)

## 🔄 Próximos Passos

1. **Implementar streaming** para respostas em tempo real
2. **Adicionar cache** para reduzir custos
3. **Implementar rate limiting** para produção
4. **Adicionar métricas** de uso e performance
5. **Criar templates** de prompts especializados

---

**Nota**: Esta integração está pronta para desenvolvimento. Para produção, considere implementar autenticação, rate limiting e monitoramento adequados. 