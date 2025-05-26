'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProfissionalRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Redireciona para a rota correta de perfil
    router.replace(`/perfil/profissional/${params.id}`);
  }, [router, params.id]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecionando...</h2>
        <p className="text-gray-500">Por favor, aguarde.</p>
      </div>
    </div>
  );
} 