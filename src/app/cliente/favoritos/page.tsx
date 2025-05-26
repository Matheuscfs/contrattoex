"use client"

import { ClientLayout } from "@/components/client/ClientLayout";
import { FavoritesList } from "@/components/client/FavoritesList";

// Dados mockados para exemplo
const mockProviders = [
  {
    id: "1",
    name: "João Silva",
    image: "/providers/provider-1.jpg",
    rating: 4.8,
    totalReviews: 156,
    location: "São Paulo, SP",
    phone: "(11) 99999-9999",
    categories: ["Ar Condicionado", "Instalação", "Manutenção"],
  },
  {
    id: "2",
    name: "Maria Oliveira",
    image: "/providers/provider-2.jpg",
    rating: 4.9,
    totalReviews: 203,
    location: "São Paulo, SP",
    phone: "(11) 98888-8888",
    categories: ["Elétrica", "Instalação", "Reparos"],
  },
  {
    id: "3",
    name: "Pedro Santos",
    image: "/providers/provider-3.jpg",
    rating: 4.7,
    totalReviews: 89,
    location: "São Paulo, SP",
    phone: "(11) 97777-7777",
    categories: ["Pintura", "Reforma", "Acabamento"],
  },
];

export default function FavoritesPage() {
  // Em produção, essas funções fariam chamadas à API
  const handleRemoveFavorite = (id: string) => {
    console.log("Remover dos favoritos:", id);
  };

  const handleScheduleService = (id: string) => {
    console.log("Agendar serviço:", id);
  };

  return (
    <ClientLayout>
      <FavoritesList
        providers={mockProviders}
        onRemoveFavorite={handleRemoveFavorite}
        onScheduleService={handleScheduleService}
      />
    </ClientLayout>
  );
} 