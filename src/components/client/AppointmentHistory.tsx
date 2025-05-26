import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Tipos de status possíveis para um agendamento
type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "in_progress";

// Mapeamento de status para exibição
const statusMap: Record<
  AppointmentStatus,
  { label: string; variant: "default" | "success" | "destructive" | "secondary" }
> = {
  scheduled: { label: "Agendado", variant: "default" },
  completed: { label: "Concluído", variant: "success" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  in_progress: { label: "Em andamento", variant: "secondary" },
};

// Interface para os dados do agendamento
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

interface AppointmentHistoryProps {
  appointments: Appointment[];
  onCancelAppointment?: (id: string) => void;
  onRateService?: (id: string) => void;
  onChatWithProvider?: (id: string) => void;
}

export function AppointmentHistory({
  appointments,
  onCancelAppointment,
  onRateService,
  onChatWithProvider,
}: AppointmentHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
      </div>

      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{appointment.serviceName}</CardTitle>
                  <CardDescription>
                    com {appointment.providerName}
                  </CardDescription>
                </div>
                <Badge variant={statusMap[appointment.status].variant}>
                  {statusMap[appointment.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {format(appointment.date, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{format(appointment.date, "HH:mm")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{appointment.providerLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{appointment.providerPhone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{appointment.providerName}</span>
                  </div>
                  <span className="font-medium">{appointment.price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {appointment.status === "scheduled" && onCancelAppointment && (
                <Button
                  variant="outline"
                  onClick={() => onCancelAppointment(appointment.id)}
                >
                  Cancelar
                </Button>
              )}
              {appointment.status === "completed" && onRateService && (
                <Button
                  variant="outline"
                  onClick={() => onRateService(appointment.id)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Avaliar
                </Button>
              )}
              {onChatWithProvider && (
                <Button
                  variant="outline"
                  onClick={() => onChatWithProvider(appointment.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Conversar
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 