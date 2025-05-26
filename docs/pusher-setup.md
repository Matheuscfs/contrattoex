# Configuração do Pusher

Este guia explica como configurar o Pusher para o sistema de notificações em tempo real.

## Pré-requisitos

1. Crie uma conta no [Pusher](https://pusher.com/)
2. Crie um novo app no Pusher
3. Obtenha as credenciais necessárias

## Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Pusher
NEXT_PUBLIC_PUSHER_KEY=sua_chave_publica_do_pusher
NEXT_PUBLIC_PUSHER_CLUSTER=seu_cluster_do_pusher
PUSHER_APP_ID=seu_app_id_do_pusher
PUSHER_SECRET=seu_secret_do_pusher
```

## Canais

O sistema usa os seguintes tipos de canais:

- `private-notifications.{user_id}`: Canal privado para notificações específicas do usuário

## Eventos

Os seguintes eventos são emitidos nos canais:

- `notification`: Nova notificação
- `notification_deleted`: Notificação excluída
- `notification_updated`: Notificação atualizada

## Tipos de Notificação

- `appointment_created`: Novo agendamento
- `appointment_updated`: Atualização de agendamento
- `appointment_cancelled`: Cancelamento de agendamento
- `chat_message`: Nova mensagem
- `status_update`: Atualização de status
- `promotion`: Promoções e ofertas

## Canais de Entrega

- `app`: Notificações no aplicativo (sempre ativo)
- `email`: Notificações por e-mail
- `sms`: Notificações por SMS
- `whatsapp`: Notificações por WhatsApp

## Horário Silencioso

Os usuários podem configurar um "horário silencioso" para cada tipo de notificação, durante o qual não receberão notificações, exceto no canal `app`.

## Exemplo de Uso

```typescript
// Enviar uma notificação
await pusherServer.trigger(
  `private-notifications.${userId}`,
  'notification',
  {
    id: 'notification-id',
    type: 'appointment_created',
    title: 'Novo Agendamento',
    message: 'Você tem um novo agendamento para amanhã',
    channels: ['app', 'email'],
    data: {
      appointmentId: 'appointment-id'
    }
  }
);
```

## Segurança

- Todos os canais são privados e requerem autenticação
- A autenticação é feita através do endpoint `/api/pusher/auth`
- O usuário só pode se inscrever em seu próprio canal de notificações
- As políticas RLS do Supabase garantem que o usuário só pode acessar suas próprias notificações e preferências 