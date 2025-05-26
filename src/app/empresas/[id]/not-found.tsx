import Link from 'next/link';
import { Building2, ArrowLeft } from 'lucide-react';

export default function CompanyNotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-16">
      <div className="text-center">
        <div className="flex justify-center">
          <Building2 className="w-16 h-16 text-primary" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Empresa não encontrada
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          A empresa que você está procurando não existe ou foi removida.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a página inicial</span>
          </Link>
        </div>
      </div>
    </main>
  );
} 