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
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { createServico } from '@/lib/services'
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
})

interface CreateServicoSheetProps {
  children: React.ReactNode
}

export function CreateServicoSheet({ children }: CreateServicoSheetProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { addServico } = useServicosContext()
  const { categorias } = useCategoriasContext()
  
  const form = useForm<z.infer<typeof servicoSchema>>({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      preco: '',
      duracao: '',
      categoria: '',
    },
  })

  async function onSubmit(values: z.infer<typeof servicoSchema>) {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      setIsLoading(true)

      const servico = await createServico(user.id, {
        nome: values.nome,
        descricao: values.descricao,
        preco: Number(values.preco),
        duracao: Number(values.duracao),
        categoria: values.categoria,
      })

      addServico(servico)
      
      toast({
        title: 'Sucesso',
        description: 'Serviço criado com sucesso!',
      })

      // Fechar o sheet e resetar o form
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o serviço.',
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
          <SheetTitle>Novo Serviço</SheetTitle>
          <SheetDescription>
            Adicione um novo serviço ao seu catálogo
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
                  {isLoading ? 'Criando...' : 'Criar Serviço'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
} 