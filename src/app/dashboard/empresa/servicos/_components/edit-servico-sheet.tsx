'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Switch,
} from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Servico, updateServico } from '@/lib/services'
import { useServicosContext } from '@/contexts/servicos-context'
import { useCategoriasContext } from '@/contexts/categorias-context'

// Schema de validação
const servicoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  preco: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Preço deve ser um número positivo',
  }),
  duracao: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Duração deve ser um número positivo',
  }),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  status: z.boolean(),
})

interface EditServicoSheetProps {
  children: React.ReactNode
  servico: Servico
}

export function EditServicoSheet({ children, servico }: EditServicoSheetProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateServicoLocal } = useServicosContext()
  const { categorias } = useCategoriasContext()
  
  const form = useForm<z.infer<typeof servicoSchema>>({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco.toString(),
      duracao: servico.duracao.toString(),
      categoria: servico.categoria,
      status: servico.status === 'ativo',
    },
  })

  async function onSubmit(values: z.infer<typeof servicoSchema>) {
    try {
      setIsLoading(true)

      const servicoAtualizado = await updateServico(servico.id, {
        nome: values.nome,
        descricao: values.descricao,
        preco: Number(values.preco),
        duracao: Number(values.duracao),
        categoria: values.categoria,
        status: values.status ? 'ativo' : 'inativo',
      })

      updateServicoLocal(servicoAtualizado)
      
      toast({
        title: 'Sucesso',
        description: 'Serviço atualizado com sucesso!',
      })
      
      // Fechar o sheet
      setOpen(false)
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o serviço.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>Editar Serviço</SheetTitle>
          <SheetDescription>
            Atualize as informações do serviço
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Corte de Cabelo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o serviço em detalhes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duracao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (min)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          placeholder="30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoria"
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
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Status do Serviço</FormLabel>
                      <FormDescription>
                        {field.value ? 'Ativo' : 'Inativo'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
} 