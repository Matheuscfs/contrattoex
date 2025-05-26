import Link from 'next/link';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-titulo font-medium text-base mb-4">Contratto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-sm text-gray-600 hover:text-gray-900">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/carreiras" className="text-sm text-gray-600 hover:text-gray-900">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-gray-600 hover:text-gray-900">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-titulo font-medium text-base mb-4">Para Empresas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/empresas" className="text-sm text-gray-600 hover:text-gray-900">
                  Contratto Empresas
                </Link>
              </li>
              <li>
                <Link href="/empresas/blog" className="text-sm text-gray-600 hover:text-gray-900">
                  Blog Contratto Empresas
                </Link>
              </li>
              <li>
                <Link href="/empresas/cadastro" className="text-sm text-gray-600 hover:text-gray-900">
                  Cadastre sua empresa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-titulo font-medium text-base mb-4">Para Profissionais</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profissionais" className="text-sm text-gray-600 hover:text-gray-900">
                  Contratto Profissionais
                </Link>
              </li>
              <li>
                <Link href="/profissionais/blog" className="text-sm text-gray-600 hover:text-gray-900">
                  Blog Contratto Profissionais
                </Link>
              </li>
              <li>
                <Link href="/profissionais/cadastro" className="text-sm text-gray-600 hover:text-gray-900">
                  Cadastre-se como profissional
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-titulo font-medium text-base mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com/contratto" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Facebook className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="https://www.instagram.com/contrattoex/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Instagram className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="https://linkedin.com/company/contratto" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Contratto. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacidade" className="text-sm text-gray-600 hover:text-gray-900">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="text-sm text-gray-600 hover:text-gray-900">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
