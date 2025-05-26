import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "@/components/forms/ServiceForm";

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  onSubmit: (data: any) => void;
}

export function ServiceFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: ServiceFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Faça as alterações necessárias no serviço selecionado."
              : "Preencha as informações para criar um novo serviço."}
          </DialogDescription>
        </DialogHeader>
        <ServiceForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
} 