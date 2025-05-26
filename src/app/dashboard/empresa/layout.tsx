import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function EmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Verifica se o usuário é uma empresa
  if (!session || session.user.role !== 'empresa') {
    redirect('/entrar')
  }

  return (
    <div className="container mx-auto px-4">
      {children}
    </div>
  )
} 