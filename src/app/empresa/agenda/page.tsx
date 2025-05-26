'use client'

import * as React from "react";
import { CompanyLayout } from "@/components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  date: string;
  time: string;
  service_id: string;
  client_name: string;
  client_phone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Service {
  id: string;
  title: string;
}

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const getStatusConfig = (status: Appointment['status']) => {
  switch (status) {
    case 'confirmed':
      return { color: 'bg-green-100 text-green-800', label: 'Confirmado' };
    case 'cancelled':
      return { color: 'bg-red-100 text-red-800', label: 'Cancelado' };
    default:
      return { color: 'bg-blue-100 text-blue-800', label: 'Pendente' };
  }
};

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  React.useEffect(() => {
    if (user) {
      loadServices();
      loadAppointments();
    }
  }, [user, selectedDate]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title')
        .eq('user_id', user?.id);

      if (error) throw error;

      setServices(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar serviços');
    }
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', dateStr);

      if (error) throw error;

      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Status atualizado com sucesso!');
      loadAppointments();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getAppointmentForTimeSlot = (time: string) => {
    return appointments.find(apt => apt.time === time);
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos do seu negócio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>
                Selecione uma data para ver os agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ptBR}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Horários - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSlots.map((time) => {
                  const appointment = getAppointmentForTimeSlot(time);
                  const service = services.find(s => s.id === appointment?.service_id);

                  return (
                    <div
                      key={time}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{time}</p>
                        {appointment ? (
                          <>
                            <p className="text-sm text-gray-500">
                              {appointment.client_name} - {service?.title}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">Disponível</p>
                        )}
                      </div>

                      {appointment && (
                        <Select
                          defaultValue={appointment.status}
                          onValueChange={(value) => handleStatusChange(appointment.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="confirmed">Confirmado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Dia</CardTitle>
            <CardDescription>
              {selectedDate?.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Total de Agendamentos
              </div>
              <div className="text-2xl font-bold">
                {appointments.length}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Horários Disponíveis
              </div>
              <div className="text-2xl font-bold">8</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Faturamento Previsto
              </div>
              <div className="text-2xl font-bold">R$ 450,00</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Taxa de Ocupação
              </div>
              <div className="text-2xl font-bold">75%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agendamentos</CardTitle>
            <CardDescription>
              Lista de agendamentos para a data selecionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                Nenhum agendamento encontrado para esta data.
              </div>
            ) : (
              <div className="space-y-6">
                {appointments.map((appointment) => {
                  const service = services.find(s => s.id === appointment.service_id);
                  const status = getStatusConfig(appointment.status);

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-start justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{service?.title}</div>
                          <Badge
                            variant="secondary"
                            className={status.color}
                          >
                            {status.label}
                          </Badge>
                        </div>

                        <div className="grid gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {appointment.client_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {appointment.client_phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CompanyLayout>
  );
} 