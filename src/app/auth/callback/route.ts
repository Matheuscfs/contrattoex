import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('Callback recebido:', { code: !!code, error, errorDescription })

  // Se há erro na URL, redirecionar para login com erro
  if (error) {
    console.error('Erro na URL do callback:', error, errorDescription)
    return NextResponse.redirect(`${requestUrl.origin}/entrar?error=${error}`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      console.log('Trocando código por sessão...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Erro ao trocar código por sessão:', error)
        return NextResponse.redirect(`${requestUrl.origin}/entrar?error=auth_error&message=${encodeURIComponent(error.message)}`)
      }

      console.log('Sessão criada com sucesso para usuário:', data.user?.id)

      // Se o usuário foi criado com sucesso, criar perfil se não existir
      if (data.user) {
        try {
          console.log('Verificando se perfil existe...')
          // Verificar se o perfil já existe
          const { data: existingProfile, error: profileCheckError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single()

          if (profileCheckError && profileCheckError.code !== 'PGRST116') {
            console.error('Erro ao verificar perfil existente:', profileCheckError)
          }

          // Se não existe, criar o perfil
          if (!existingProfile) {
            console.log('Criando perfil para usuário:', data.user.id)
            const { error: profileError } = await supabase.rpc('create_user_profile', {
              user_id: data.user.id,
              user_email: data.user.email || '',
              user_name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuário',
              user_role: data.user.user_metadata?.role || 'customer'
            });

            if (profileError) {
              console.error('Erro ao criar perfil no callback:', profileError);
              // Não bloquear o fluxo se o perfil falhar
            } else {
              console.log('Perfil criado com sucesso')
            }
          } else {
            console.log('Perfil já existe')
          }
        } catch (profileError) {
          console.error('Erro ao verificar/criar perfil:', profileError);
          // Não bloquear o fluxo se o perfil falhar
        }
      }

      // Redirecionar baseado no role do usuário
      const userRole = data.user?.user_metadata?.role || 'customer'
      console.log('Redirecionando usuário com role:', userRole)
      
      let redirectUrl = `${requestUrl.origin}/dashboard`
      
      if (userRole === 'customer') {
        redirectUrl = `${requestUrl.origin}/cliente`
      } else if (userRole === 'professional') {
        redirectUrl = `${requestUrl.origin}/profissional`
      } else if (userRole === 'business') {
        redirectUrl = `${requestUrl.origin}/empresa`
      }

      console.log('Redirecionando para:', redirectUrl)
      return NextResponse.redirect(redirectUrl)
      
    } catch (error) {
      console.error('Erro no callback de autenticação:', error)
      return NextResponse.redirect(`${requestUrl.origin}/entrar?error=callback_error&message=${encodeURIComponent(String(error))}`)
    }
  }

  // Se não há código, redirecionar para login
  console.log('Nenhum código encontrado, redirecionando para login')
  return NextResponse.redirect(`${requestUrl.origin}/entrar`)
} 