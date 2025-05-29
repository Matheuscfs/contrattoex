import Link from "next/link"
import { UserNav } from "@/components/dashboard/user-nav"
import Image from "next/image"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Image
              src="/contratto-logo.png"
              alt="Contratto"
              width={120}
              height={32}
              priority
              className="mr-2"
            />
          </Link>
        </div>
        <UserNav />
      </div>
    </header>
  )
} 