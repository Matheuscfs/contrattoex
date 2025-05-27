'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface OrcamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    price: {
      value: number;
      unit: string;
      min?: number;
      max?: number;
    };
  };
  company: {
    id: string;
    nome: string;
  };
}

export function OrcamentoModal({ isOpen, onClose, service, company }: OrcamentoModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    dataPreferida: undefined as Date | undefined,
    horarioPreferido: '',
    descricao: '',
    urgencia: 'normal' as 'baixa' | 'normal' | 'alta'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aqui você faria a chamada para a API
      console.log('Dados do orçamento:', {
        ...formData,
        servicoId: service.id,
        empresaId: company.id
      });

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mostrar sucesso e fechar modal
      alert('Solicitação de orçamento enviada com sucesso! A empresa entrará em contato em breve.');
      onClose();
      
      // Reset form
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        endereco: '',
        dataPreferida: undefined,
        horarioPreferido: '',
        descricao: '',
        urgencia: 'normal'
      });
    } catch (error) {
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Orçamento</DialogTitle>
          <DialogDescription>
            Solicite um orçamento para <strong>{service.name}</strong> da empresa <strong>{company.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Suas informações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  required
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço do serviço *</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                required
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
          </div>

          {/* Preferências de Agendamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferências de agendamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Data preferida</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dataPreferida && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataPreferida ? (
                        format(formData.dataPreferida, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dataPreferida}
                      onSelect={(date) => setFormData(prev => ({ ...prev, dataPreferida: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="horario">Horário preferido</Label>
                <Input
                  id="horario"
                  type="time"
                  value={formData.horarioPreferido}
                  onChange={(e) => setFormData(prev => ({ ...prev, horarioPreferido: e.target.value }))}
                  placeholder="14:00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="urgencia">Urgência</Label>
              <select
                id="urgencia"
                value={formData.urgencia}
                onChange={(e) => setFormData(prev => ({ ...prev, urgencia: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="baixa">Baixa - Posso aguardar</option>
                <option value="normal">Normal - Dentro de alguns dias</option>
                <option value="alta">Alta - Preciso urgente</option>
              </select>
            </div>
          </div>

          {/* Descrição do Serviço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detalhes do serviço</h3>
            
            <div>
              <Label htmlFor="descricao">Descreva o que você precisa</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva detalhadamente o serviço que você precisa, incluindo qualquer informação relevante..."
                rows={4}
              />
            </div>
          </div>

          {/* Resumo do Orçamento */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Resumo da solicitação</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Serviço:</span>
                <span className="font-medium">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Empresa:</span>
                <span className="font-medium">{company.nome}</span>
              </div>
              <div className="flex justify-between">
                <span>Preço estimado:</span>
                <span className="font-medium text-primary">
                  {service.price.min && service.price.max ? (
                    `R$ ${service.price.min} - R$ ${service.price.max}`
                  ) : (
                    `R$ ${service.price.value}/${service.price.unit === 'hour' ? 'hora' : service.price.unit}`
                  )}
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Solicitar Orçamento'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 