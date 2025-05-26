"use client"

import { ClientLayout } from "@/components/client/ClientLayout";
import { AppointmentHistory } from "@/components/client/AppointmentHistory";

type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "in_progress";

interface Appointment {
  id: string;
  serviceName: string;
  providerName: string;
  providerLocation: string;
  providerPhone: string;
  date: Date;
  status: AppointmentStatus;
  price: string;
}

// Dados mockados para exemplo
const mockAppointments: Appointment[] = [
  {
    id: "1",
    serviceName: "Instalação de Ar Condicionado",
    providerName: "João Silva",
    providerLocation: "Rua das Flores, 123",
    providerPhone: "(11) 99999-9999",
    date: new Date("2024-03-25T14:00:00"),
    status: "scheduled",
    price: "R$ 350,00",
  },
  {
    id: "2",
    serviceName: "Manutenção Elétrica",
    providerName: "Maria Oliveira",
    providerLocation: "Av. Principal, 456",
    providerPhone: "(11) 98888-8888",
    date: new Date("2024-03-20T10:00:00"),
    status: "completed",
    price: "R$ 200,00",
  },
  {
    id: "3",
    serviceName: "Pintura Residencial",
    providerName: "Pedro Santos",
    providerLocation: "Rua do Comércio, 789",
    providerPhone: "(11) 97777-7777",
    date: new Date("2024-03-18T09:00:00"),
    status: "cancelled",
    price: "R$ 800,00",
  },
];

export default function AppointmentsPage() {
  // Em produção, essas funções fariam chamadas à API
  const handleCancelAppointment = (id: string) => {
    console.log("Cancelar agendamento:", id);
  };

  const handleRateService = (id: string) => {
    console.log("Avaliar serviço:", id);
  };

  const handleChatWithProvider = (id: string) => {
    console.log("Conversar com prestador:", id);
  };

  return (
    <ClientLayout>
      <AppointmentHistory
        appointments={mockAppointments}
        onCancelAppointment={handleCancelAppointment}
        onRateService={handleRateService}
        onChatWithProvider={handleChatWithProvider}
      />
    </ClientLayout>
  );
} 