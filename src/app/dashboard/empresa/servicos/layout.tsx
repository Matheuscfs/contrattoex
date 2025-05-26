import { ServicosProvider } from '@/contexts/servicos-context'
import { CategoriasProvider } from '@/contexts/categorias-context'

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ServicosProvider>
      <CategoriasProvider>
        {children}
      </CategoriasProvider>
    </ServicosProvider>
  )
} 