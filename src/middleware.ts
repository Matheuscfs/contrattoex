import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/', '/sobre', '/contato', '/privacidade', '/termos']
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname === route || req.nextUrl.pathname === route + '/'
  )

  // Rotas públicas com subpaths
  const publicPathStarts = ['/empresas', '/auth']
  const isPublicPathStart = publicPathStarts.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Se for uma rota pública, permite o acesso
  if (isPublicRoute || isPublicPathStart) {
    return res
  }

  // Rotas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/empresa', '/profissional', '/cliente']
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Rotas de autenticação
  const authRoutes = ['/login', '/cadastro', '/entrar']
  const isAuthRoute = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Redireciona usuários não autenticados para o login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/entrar', req.url)
    redirectUrl.searchParams.set('from', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redireciona usuários autenticados para o dashboard apropriado
  if (isAuthRoute && session) {
    const userRole = session.user?.user_metadata?.role || 'customer'
    const redirectPath = `/${userRole === 'business' ? 'empresa' : userRole === 'professional' ? 'profissional' : 'cliente'}/perfil`
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  return res
}

// Configurar os caminhos que o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 