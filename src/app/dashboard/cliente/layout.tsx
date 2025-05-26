import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <DashboardHeader />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav
            items={[
              {
                title: "Meus Agendamentos",
                href: "/dashboard/cliente/agendamentos",
                icon: "calendar",
              },
              {
                title: "Favoritos",
                href: "/dashboard/cliente/favoritos",
                icon: "heart",
              },
              {
                title: "Avaliações",
                href: "/dashboard/cliente/avaliacoes",
                icon: "star",
              },
              {
                title: "Configurações",
                href: "/dashboard/cliente/configuracoes",
                icon: "settings",
              },
            ]}
          />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
} 