import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceFormSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter no mínimo 10 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  duration: z
    .number()
    .min(5, "A duração mínima é de 5 minutos")
    .max(480, "A duração máxima é de 8 horas"),
  price: z
    .number()
    .min(0, "O preço não pode ser negativo")
    .max(10000, "O preço máximo é de R$ 10.000"),
  category: z.string().min(1, "Selecione uma categoria"),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const categories = [
  { id: "cabelo", name: "Cabelo" },
  { id: "barba", name: "Barba" },
  { id: "manicure", name: "Manicure" },
  { id: "pedicure", name: "Pedicure" },
  { id: "estetica", name: "Estética" },
  { id: "depilacao", name: "Depilação" },
  { id: "maquiagem", name: "Maquiagem" },
];

interface ServiceFormProps {
  initialData?: ServiceFormValues;
  onSubmit: (data: ServiceFormValues) => void;
  onCancel: () => void;
}

export function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Serviço</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Corte de Cabelo" {...field} />
              </FormControl>
              <FormDescription>
                Nome que será exibido para os clientes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os detalhes do serviço..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explique o que está incluso no serviço
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Tempo estimado do serviço</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Valor cobrado pelo serviço</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Categoria do serviço</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Salvar Alterações" : "Criar Serviço"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 