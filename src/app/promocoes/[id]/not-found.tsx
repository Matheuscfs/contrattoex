import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Promoção não encontrada
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A promoção que você está procurando não existe ou já expirou.
        </p>
        <Link href="/promocoes">
          <Button className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para promoções
          </Button>
        </Link>
      </div>
    </main>
  );
} 