import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { pusherServer } from '@/lib/pusher'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.formData()
    const socketId = data.get('socket_id')?.toString()
    const channel = data.get('channel_name')?.toString()

    if (!socketId || !channel) {
      return NextResponse.json(
        { error: 'Socket ID e canal são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o canal é privado e pertence ao usuário
    if (channel.startsWith('private-notifications.')) {
      const channelUserId = channel.split('.')[1]
      if (channelUserId !== session.user.id) {
        return NextResponse.json(
          { error: 'Não autorizado para este canal' },
          { status: 403 }
        )
      }
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channel)
    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Erro na autenticação do Pusher:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 