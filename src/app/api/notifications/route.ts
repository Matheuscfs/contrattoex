import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { WebSocket, WebSocketServer } from "ws";

// Inicializar Supabase apenas se as variáveis estiverem disponíveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// Armazenar conexões WebSocket ativas
const clients = new Map<string, WebSocket>();

// Configurar WebSocket Server (em produção, usar serviço dedicado como Pusher)
if (process.env.NODE_ENV === "development") {
  const wss = new WebSocketServer({ port: 3001 });

  wss.on("connection", (ws, req) => {
    const userId = new URL(req.url!, `http://${req.headers.host}`).searchParams.get(
      "userId"
    );

    if (userId) {
      clients.set(userId, ws);

      ws.on("close", () => {
        clients.delete(userId);
      });
    }
  });
}

// Função para enviar notificação via WebSocket
async function sendNotification(userId: string, notification: any) {
  const ws = clients.get(userId);
  if (ws) {
    ws.send(JSON.stringify(notification));
  }

  // Salvar notificação no banco apenas se supabase estiver configurado
  if (supabase) {
    await supabase.from("notifications").insert([
      {
        user_id: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
      },
    ]);
  }
}

// GET /api/notifications
export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT /api/notifications/[id]/read
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { id } = params;

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/notifications/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { id } = params;

  const { error } = await supabase.from("notifications").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Exemplo de uso:
// await sendNotification(userId, {
//   type: "appointment",
//   title: "Novo agendamento",
//   message: "Seu serviço foi agendado com sucesso",
//   data: { appointmentId: "123" },
// }); 