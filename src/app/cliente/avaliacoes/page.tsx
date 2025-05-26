"use client"

import { ClientLayout } from "@/components/client/ClientLayout";
import { ReviewsList } from "@/components/client/ReviewsList";

// Dados mockados para exemplo
const mockReviews = [
  {
    id: "1",
    serviceName: "Instalação de Ar Condicionado",
    providerName: "João Silva",
    rating: 5,
    comment:
      "Excelente profissional! Muito pontual e organizado. O serviço foi realizado com perfeição e o ambiente ficou limpo após a instalação. Recomendo!",
    date: new Date("2024-03-15"),
    images: [
      "/reviews/review-1-1.jpg",
      "/reviews/review-1-2.jpg",
      "/reviews/review-1-3.jpg",
    ],
  },
  {
    id: "2",
    serviceName: "Manutenção Elétrica",
    providerName: "Maria Oliveira",
    rating: 4,
    comment:
      "Bom serviço, resolveu o problema rapidamente. Apenas achei o preço um pouco alto, mas a qualidade do trabalho compensou.",
    date: new Date("2024-03-10"),
  },
  {
    id: "3",
    serviceName: "Pintura Residencial",
    providerName: "Pedro Santos",
    rating: 5,
    comment:
      "Trabalho impecável! O Pedro e sua equipe foram muito profissionais e cuidadosos. O acabamento ficou perfeito e eles cumpriram o prazo combinado.",
    date: new Date("2024-03-05"),
    images: [
      "/reviews/review-3-1.jpg",
      "/reviews/review-3-2.jpg",
    ],
  },
];

export default function ReviewsPage() {
  // Em produção, essas funções fariam chamadas à API
  const handleEditReview = (id: string) => {
    console.log("Editar avaliação:", id);
  };

  const handleDeleteReview = (id: string) => {
    console.log("Excluir avaliação:", id);
  };

  return (
    <ClientLayout>
      <ReviewsList
        reviews={mockReviews}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />
    </ClientLayout>
  );
} 