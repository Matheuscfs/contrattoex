"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: string
}

interface DashboardNavProps {
  items: NavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => {
        const Icon = require("lucide-react")[item.icon] as LucideIcon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              path === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
} 