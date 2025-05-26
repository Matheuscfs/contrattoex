import { AgendamentosProvider } from '@/contexts/agendamentos-context'

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AgendamentosProvider tipo="empresa">
      {children}
    </AgendamentosProvider>
  )
} 