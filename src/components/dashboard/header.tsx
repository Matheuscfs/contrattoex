import Link from "next/link"
import { UserNav } from "@/components/dashboard/user-nav"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">
              Contratto
            </span>
          </Link>
        </div>
        <UserNav />
      </div>
    </header>
  )
} 