import Link from 'next/link'
import Image from 'next/image'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  backLink?: {
    href: string
    text: string
  }
}

export function AuthLayout({
  children,
  title,
  subtitle,
  backLink,
}: AuthLayoutProps) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.svg"
            alt="iServiços"
            width={150}
            height={40}
            priority
          />
        </Link>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        )}
        {backLink && (
          <p className="mt-2 text-sm text-muted-foreground">
            <Link href={backLink.href} className="text-primary hover:text-primary/80">
              {backLink.text}
            </Link>
          </p>
        )}
      </div>

      {children}
    </div>
  )
} 