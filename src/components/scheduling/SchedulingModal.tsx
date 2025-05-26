"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  providerName: string;
  price: string;
}

// Horários disponíveis (em produção viria da API)
const availableTimeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function SchedulingModal({
  isOpen,
  onClose,
  serviceName,
  providerName,
  price,
}: SchedulingModalProps) {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>();
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Função para formatar o telefone
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({
        ...prev,
        [name]: formatPhone(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNext = async () => {
    if (step === 1 && date && time) {
      setStep(2);
    } else if (step === 2) {
      setIsSubmitting(true);
      try {
        // Simula envio para API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset do formulário
          setDate(undefined);
          setTime(undefined);
          setFormData({
            name: "",
            phone: "",
            email: "",
            notes: "",
          });
          setStep(1);
          setShowSuccess(false);
        }, 2000);
      } catch (error) {
        console.error("Erro ao agendar:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {showSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-green-600"
                role="img"
                aria-label="Ícone de sucesso"
              >
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600">Agendamento Confirmado!</h2>
            <p className="text-gray-600">
              Você receberá um e-mail com os detalhes do agendamento.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Agendar Serviço</DialogTitle>
              <DialogDescription>
                {serviceName} com {providerName}
                <br />
                <span className="font-medium text-foreground">{price}</span>
              </DialogDescription>
            </DialogHeader>

            {step === 1 ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Selecione a data</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className="rounded-md border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Selecione o horário</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Adicione informações importantes para o prestador"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Voltar
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={step === 1 ? (!date || !time) : isSubmitting}
              >
                {step === 1 ? "Continuar" : isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirmando...
                  </div>
                ) : "Confirmar Agendamento"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 