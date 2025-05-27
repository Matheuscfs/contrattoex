import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/components/notifications/NotificationProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Toaster } from 'sonner';

// Otimização de fonte com subset reduzido
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: '--font-inter',
});

// Configuração de viewport otimizada
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#EA1D2C',
  viewportFit: 'cover',
};

// Metadata otimizada
export const metadata: Metadata = {
  title: {
    default: 'Contratto - Conectando Profissionais e Empresas',
    template: '%s | Contratto'
  },
  description: 'Encontre os melhores profissionais e empresas para seus serviços',
  keywords: ['serviços', 'profissionais', 'empresas', 'marketplace', 'contratto'],
  authors: [{ name: 'Contratto' }],
  creator: 'Contratto',
  publisher: 'Contratto',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.className} antialiased`}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster richColors position="top-right" />
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
